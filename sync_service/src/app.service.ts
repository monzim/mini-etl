import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { PrismaService } from './database/prisma.service';
import { NewConnectionDto } from './dto/new-connection.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly prisma: PrismaService) {}

  async handleNewConnection(payload: NewConnectionDto) {
    const connection = await this.prisma.dataSources.findUnique({
      where: { id: payload.dataSources },
    });

    let isValid = false;
    let error: string;

    if (connection.type === 'POSTGRES') {
      const k = await this.validatePostgresConnection(connection.pgUrl);
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
      where: { id: payload.dataSources },
      data: {
        connected: isValid,
        setupError: error,
        lastConnectionCheck: new Date(),
      },
    });
  }

  private async validatePostgresConnection(
    pgUrl: string,
  ): Promise<{ isValid: boolean; error?: string }> {
    const client = new Client({ connectionString: pgUrl });

    try {
      await client.connect();
      this.logger.log('PostgreSQL connection is valid');

      return { isValid: true };
    } catch (error) {
      this.logger.error('PostgreSQL connection is invalid', error.message);

      return { isValid: false, error: error.message };
    } finally {
      await client.end();
    }
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
