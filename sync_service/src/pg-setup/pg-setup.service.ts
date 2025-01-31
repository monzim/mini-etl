import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class PgSetupService {
  private readonly logger = new Logger(PgSetupService.name);
  constructor() {}

  async setupPostgresSchema(pgUrl: string, scopes: string[]) {
    const client = new Client({ connectionString: pgUrl });
    try {
      await client.connect();
      await client.query('CREATE SCHEMA IF NOT EXISTS github_data;');
      this.logger.log('PostgreSQL schema created or already exists');

      if (scopes.includes('PUBLIC_REPO')) {
        await this.createRepositoryTable(client).catch((error) => {
          this.logger.error('Error creating Repository table', error.message);
        });
      }
      if (scopes.includes('ISSUES')) {
        await this.createIssuesTable(client).catch((error) => {
          this.logger.error('Error creating Issues table', error.message);
        });
      }
      if (scopes.includes('PULL_REQUESTS')) {
        await this.createPullRequestsTable(client).catch((error) => {
          this.logger.error('Error creating PullRequests table', error.message);
        });
      }
    } catch (error) {
      this.logger.error('Error setting up PostgreSQL schema', error.message);
    } finally {
      await client.end();
    }
  }

  private async createRepositoryTable(client: Client) {
    const tableExists = await this.checkTableExists(client, 'Repository');
    if (!tableExists) {
      await client.query(`
      CREATE TABLE github_data.Repository (
        id VARCHAR PRIMARY KEY,
        node_id VARCHAR,
        name VARCHAR,
        full_name VARCHAR,
        private BOOLEAN,
        description TEXT,
        fork BOOLEAN,
        url VARCHAR,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        pushed_at TIMESTAMP,
        homepage VARCHAR,
        size INT,
        stargazers_count INT,
        watchers_count INT,
        language VARCHAR,
        has_issues BOOLEAN,
        has_projects BOOLEAN,
        has_downloads BOOLEAN,
        has_wiki BOOLEAN,
        has_pages BOOLEAN,
        has_discussions BOOLEAN,
        forks_count INT,
        archived BOOLEAN,
        disabled BOOLEAN,
        open_issues_count INT,
        license VARCHAR,
        allow_forking BOOLEAN,
        is_template BOOLEAN,
        web_commit_signoff_required BOOLEAN,
        topics VARCHAR[],
        visibility VARCHAR,
        forks INT,
        open_issues INT,
        watchers INT,
        default_branch VARCHAR
      );
    `);
      this.logger.log('PostgreSQL Repository table created');
    } else {
      this.logger.log('PostgreSQL Repository table already exists');
    }
  }

  private async createIssuesTable(client: Client) {
    const tableExists = await this.checkTableExists(client, 'Issues');
    if (!tableExists) {
      await client.query(`
      CREATE TABLE github_data.Issues (
        id VARCHAR PRIMARY KEY,
        repository_id VARCHAR,
        url VARCHAR,
        node_id VARCHAR,
        number INT,
        title VARCHAR,
        "user" JSONB,
        labels JSONB[],
        state VARCHAR,
        locked BOOLEAN,
        assignee JSONB,
        assignees JSONB[],
        milestone JSONB,
        comments INT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        closed_at TIMESTAMP,
        author_association VARCHAR,
        active_lock_reason VARCHAR,
        draft BOOLEAN,
        pull_request JSONB,
        body TEXT,
        reactions JSONB,
        performed_via_github_app JSONB,
        state_reason VARCHAR,
        FOREIGN KEY (repository_id) REFERENCES github_data.Repository(id)
      );
    `);
      this.logger.log('PostgreSQL Issues table created');
    } else {
      this.logger.log('PostgreSQL Issues table already exists');
    }
  }

  private async createPullRequestsTable(client: Client) {
    const tableExists = await this.checkTableExists(client, 'PullRequests');
    if (!tableExists) {
      await client.query(`
      CREATE TABLE github_data.PullRequests (
        id VARCHAR PRIMARY KEY,
        repository_id VARCHAR,
        url VARCHAR,
        node_id VARCHAR,
        number INT,
        state VARCHAR,
        locked BOOLEAN,
        title VARCHAR,
        "user" JSONB,
        body TEXT,
        created_at TIMESTAMP,
        updated_at TIMESTAMP,
        closed_at TIMESTAMP,
        merged_at TIMESTAMP,
        merge_commit_sha VARCHAR,
        assignee JSONB,
        assignees JSONB[],
        requested_reviewers JSONB[],
        requested_teams JSONB[],
        milestone JSONB,
        draft BOOLEAN,
        head JSONB,
        base JSONB,
        author_association VARCHAR,
        auto_merge JSONB,
        active_lock_reason VARCHAR,
        FOREIGN KEY (repository_id) REFERENCES github_data.Repository(id)
      );
    `);
      this.logger.log('PostgreSQL PullRequests table created');
    } else {
      this.logger.log('PostgreSQL PullRequests table already exists');
    }
  }

  private async checkTableExists(
    client: Client,
    tableName: string,
  ): Promise<boolean> {
    const result = await client.query(
      `
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'github_data' AND table_name = $1
    );
  `,
      [tableName],
    );
    return result.rows[0].exists;
  }

  async validatePostgresConnection(
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
}
