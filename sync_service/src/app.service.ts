import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';
import { DataSyncService } from './data-sync/data-sync.service';
import { DrizzleService } from './database/drizzle.service';
import { PrismaService } from './database/prisma.service';
import { ConnectedSourceDto } from './dto/connected-source.dto';
import { NewConnectionDto } from './dto/new-connection.dto';
import { SyncNowDto } from './dto/sync-now.dto';
import { SyncQueryDto } from './dto/sync-query.dto';
import { PgSetupService } from './pg-setup/pg-setup.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly dataSync: DataSyncService,
    private readonly pgSetupService: PgSetupService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async getSyncData(payload: SyncQueryDto) {
    const connection = await this.prisma.dataSourceConnections.findUnique({
      where: { id: payload.connection_id },
      include: {
        dataSource: true,
      },
    });

    const { dataSource, ...rest } = connection;
    if (dataSource.type === 'POSTGRES') {
      let data = [];
      const drizzle = await this.drizzleService.getDrizzle(dataSource.pgUrl);
      if (payload.query === 'PUBLIC_REPO') {
        data = await drizzle.query.Repository.findMany();
      } else if (payload.query === 'PULL_REQUESTS') {
        data = await drizzle.query.PullRequests.findMany();
      } else if (payload.query === 'ISSUES') {
        data = await drizzle.query.Issues.findMany();
      }

      return {
        payload,
        connection: rest,
        type: dataSource.type,
        data: data,
      };
    }

    if (dataSource.type === 'S3') {
      const s3 = new S3({
        apiVersion: '2006-03-01',
        region: dataSource.s3Region,
        endpoint: dataSource.s3Endpoint,
        credentials: {
          accessKeyId: dataSource.s3Key,
          secretAccessKey: dataSource.s3Secret,
        },
      });

      const data = await this.getS3RepositoryData(
        s3,
        dataSource.s3Bucket,
        dataSource.id,
        payload.query as 'PUBLIC_REPO' | 'ISSUES' | 'PULL_REQUESTS',
      );

      return {
        payload,
        connection: rest,
        type: dataSource.type,
        data: data,
      };
    }
  }

  private async getS3RepositoryData(
    s3: S3,
    bucket: string,
    data_source_id: string,
    type: 'PUBLIC_REPO' | 'ISSUES' | 'PULL_REQUESTS',
  ) {
    const scope =
      type === 'PUBLIC_REPO'
        ? 'repositories'
        : type === 'ISSUES'
          ? 'issues'
          : 'pull_requests';

    const key = `github/${data_source_id}_${scope}.json`;
    try {
      const data = await s3.getObject({ Bucket: bucket, Key: key });
      if (data.Body) {
        const bodyContent = await this.streamToString(data.Body);
        return JSON.parse(bodyContent);
      } else {
        this.logger.error('No data found in S3 object for ' + type);
        return [];
      }
    } catch (err) {
      this.logger.error('Error fetching data from S3 ' + type, err);
      return [];
    }
  }

  private async streamToString(stream: any): Promise<string> {
    if (typeof stream === 'string') {
      return stream;
    }
    if (Buffer.isBuffer(stream)) {
      return stream.toString('utf-8');
    }

    if (stream instanceof Readable) {
      return new Promise<string>((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () =>
          resolve(Buffer.concat(chunks).toString('utf-8')),
        );
        stream.on('error', reject);
      });
    }

    throw new Error('Unsupported stream type');
  }

  async handleSyncNow(payload: SyncNowDto) {
    this.dataSync.syncData(payload.user_id);
  }

  async handleNewConnection(payload: ConnectedSourceDto) {
    const connection = await this.prisma.dataSourceConnections.findUnique({
      where: { id: payload.join_id },
      include: {
        dataSource: true,
        provider: true,
      },
    });

    if (!connection.dataSource.connected) {
      await this.prisma.dataSourceConnections.update({
        where: { id: payload.join_id },
        data: {
          syncError:
            'Data source is not connected so cannot sync. Please check your connection.',
        },
      });

      return this.logger.error('Data source is not connected so cannot sync');
    }

    const scopes = connection.scopes.map((scope) => scope.toString());
    if (connection.dataSource.type === 'POSTGRES') {
      this.pgSetupService.setupPostgresSchema(
        connection.dataSource.pgUrl,
        scopes,
      );
    }

    if (connection.dataSource.type === 'S3') {
      this.logger.log('S3 connection setup not implemented');
    }

    await this.dataSync.syncData(connection.provider.user_id);
  }

  async handleNewDataSource(payload: NewConnectionDto) {
    const connection = await this.prisma.dataSources.findUnique({
      where: { id: payload.connection_id },
    });

    let isValid = false;
    let error: string;

    if (connection.type === 'POSTGRES') {
      const k = await this.pgSetupService.validatePostgresConnection(
        connection.pgUrl,
      );
      isValid = k.isValid;
      error = k.error;
    } else if (connection.type === 'S3') {
      const k = await this.validateS3Connection(
        connection.s3Bucket,
        connection.s3Key,
        connection.s3Secret,
        connection.s3Region,
        connection.s3Endpoint,
      );

      isValid = k.isValid;
      error = k.error;
    }

    await this.prisma.dataSources.update({
      where: { id: payload.connection_id },
      data: {
        connected: isValid,
        setupError: error,
        lastConnectionCheck: new Date(),
      },
    });
  }

  private async validateS3Connection(
    bucket: string,
    key: string,
    secret: string,
    region: string,
    endpoint?: string,
  ): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      region: region,
      endpoint: endpoint,
      credentials: {
        accessKeyId: key,
        secretAccessKey: secret,
      },
    });

    try {
      await s3.headBucket({ Bucket: bucket });
      this.logger.log('S3 connection is valid');
      return { isValid: true };
    } catch (error) {
      this.logger.error('S3 connection is invalid', error.message);
      return { isValid: false, error: error.message };
    }
  }
}
