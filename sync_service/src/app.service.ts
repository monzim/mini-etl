import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';
import { PrismaService } from './database/prisma.service';
import { ConnectedSourceDto } from './dto/connected-source.dto';
import { NewConnectionDto } from './dto/new-connection.dto';
import { SyncNowDto } from './dto/sync-now.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly prisma: PrismaService) {}

  handleSyncNow(payload: SyncNowDto) {
    console.log('Syncing data for user', payload.user_id);
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
    this.setupPostgresSchema(connection.dataSource.pgUrl, scopes);
  }

  async handleNewDataSource(payload: NewConnectionDto) {
    const connection = await this.prisma.dataSources.findUnique({
      where: { id: payload.connection_id },
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
      where: { id: payload.connection_id },
      data: {
        connected: isValid,
        setupError: error,
        lastConnectionCheck: new Date(),
      },
    });
  }

  private async setupPostgresSchema(pgUrl: string, scopes: string[]) {
    const client = new Client({ connectionString: pgUrl });

    try {
      await client.connect();

      const schemaCheckResult = await client.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name = 'github_data';
    `);

      if (schemaCheckResult.rowCount === 0) {
        let createSchemaQuery = `CREATE SCHEMA github_data;`;

        if (scopes.includes('PUBLIC_REPO')) {
          createSchemaQuery += `
          CREATE TABLE github_data.repos (
            id SERIAL PRIMARY KEY,
            github_id INT UNIQUE,
            name VARCHAR(255) NOT NULL,
            url VARCHAR(255) NOT NULL,
            user_id VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `;
        }

        if (scopes.includes('ISSUES')) {
          createSchemaQuery += `
          CREATE TABLE github_data.issues (
            id SERIAL PRIMARY KEY,
            github_id INT UNIQUE,
            title VARCHAR(255) NOT NULL,
            body TEXT,
            state VARCHAR(50),
            repository_id INT REFERENCES github_data.repos(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `;
        }

        if (scopes.includes('PULL_REQUESTS')) {
          createSchemaQuery += `
          CREATE TABLE github_data.pull_requests (
            id SERIAL PRIMARY KEY,
            github_id INT UNIQUE,
            title VARCHAR(255) NOT NULL,
            body TEXT,
            state VARCHAR(50),
            repository_id INT REFERENCES github_data.repos(id),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
        `;
        }

        await client.query(createSchemaQuery);
        this.logger.log('PostgreSQL schema and tables created based on scopes');
      } else {
        this.logger.log('PostgreSQL schema already exists');

        if (scopes.includes('PUBLIC_REPO')) {
          const reposTableCheck = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'github_data'
          AND table_name = 'repos';
        `);

          if (reposTableCheck.rowCount === 0) {
            await client.query(`
            CREATE TABLE github_data.repos (
              id SERIAL PRIMARY KEY,
              github_id INT UNIQUE,
              name VARCHAR(255) NOT NULL,
              url VARCHAR(255) NOT NULL,
              user_id VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            );
          `);
            this.logger.log('PostgreSQL repos table created');
          } else {
            this.logger.log('PostgreSQL repos table already exists');
          }
        }

        if (scopes.includes('ISSUES')) {
          const issuesTableCheck = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'github_data'
          AND table_name = 'issues';
        `);

          if (issuesTableCheck.rowCount === 0) {
            await client.query(`
            CREATE TABLE github_data.issues (
              id SERIAL PRIMARY KEY,
              github_id INT UNIQUE,
              title VARCHAR(255) NOT NULL,
              body TEXT,
              state VARCHAR(50),
              repository_id INT REFERENCES github_data.repos(id),
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            );
          `);
            this.logger.log('PostgreSQL issues table created');
          } else {
            this.logger.log('PostgreSQL issues table already exists');
          }
        }

        if (scopes.includes('PULL_REQUESTS')) {
          const pullRequestsTableCheck = await client.query(`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'github_data'
          AND table_name = 'pull_requests';
        `);

          if (pullRequestsTableCheck.rowCount === 0) {
            await client.query(`
            CREATE TABLE github_data.pull_requests (
              id SERIAL PRIMARY KEY,
              github_id INT UNIQUE,
              title VARCHAR(255) NOT NULL,
              body TEXT,
              state VARCHAR(50),
              repository_id INT REFERENCES github_data.repos(id),
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
            );
          `);
            this.logger.log('PostgreSQL pull_requests table created');
          } else {
            this.logger.log('PostgreSQL pull_requests table already exists');
          }
        }
      }
    } catch (error) {
      this.logger.error('Error setting up PostgreSQL schema', error.message);
    } finally {
      await client.end();
    }
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
