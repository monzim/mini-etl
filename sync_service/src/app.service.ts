import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
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
    const dataSource = await this.prisma.dataSources.findUnique({
      where: { id: payload.data_source_id },
    });

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
        data: data,
      };
    }

    if (dataSource.type === 'S3') {
      return {};
    }
  }

  async handleSyncNow(payload: SyncNowDto) {
    this.dataSync.syncData(payload.user_id);
  }

  async handleNewConnection(payload: ConnectedSourceDto) {
    const connection = await this.prisma.dataSourceConnections.findUnique({
      where: { id: payload.join_id },
      include: {
        dataSource: true,
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
    this.pgSetupService.setupPostgresSchema(
      connection.dataSource.pgUrl,
      scopes,
    );
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
  ): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    const s3 = new S3({
      apiVersion: '2006-03-01',
      region: region,
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
