import { S3 } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleService } from 'src/database/drizzle.service';
import {
  Issues as Iss,
  PullRequests as PR,
  Repository as Repo,
} from 'src/database/drizzle/schema';
import { PrismaService } from 'src/database/prisma.service';
import { Issues } from 'src/interfaces/Issue.interface';
import { PullRequest } from 'src/interfaces/PullRequest.interface';
import { Repository } from 'src/interfaces/Repository.interface';
import { GithubService } from './github.service';

@Injectable()
export class DataSyncService {
  private readonly logger = new Logger(DataSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GithubService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async syncData(userId: string) {
    this.logger.log('Syncing data for user ' + userId);
    const connections = await this.prisma.dataSourceConnections.findMany({
      where: {
        syncOn: true,
        dataSource: {
          connected: true,
          user_id: userId,
        },
      },
      include: { provider: true, dataSource: true },
    });

    for (const conn of connections) {
      let repos: Repository[] = [];
      let issues: Issues[] = [];
      let prs: PullRequest[] = [];

      if (conn.provider.type === 'GITHUB') {
        const accessToken = conn.provider.accessToken;
        if (conn.scopes.includes('PUBLIC_REPO')) {
          repos = await this.githubService.getRepositories(accessToken);
        }

        if (conn.scopes.includes('ISSUES')) {
          issues = await this.getIssues(accessToken, repos);
        }

        if (conn.scopes.includes('PULL_REQUESTS')) {
          prs = await this.getPullRequests(accessToken, repos);
        }
      }

      if (conn.dataSource.type === 'POSTGRES') {
        const drizzle = await this.drizzleService.getDrizzle(
          conn.dataSource.pgUrl,
        );

        if (repos.length > 0) {
          await this.addRepoToPg(drizzle, repos);
        }

        if (issues.length > 0) {
          await this.addIssues(drizzle, issues);
        }

        if (prs.length > 0) {
          await this.addPullRequests(drizzle, prs);
        }
      } else if (conn.dataSource.type === 'S3') {
        const s3 = new S3({
          apiVersion: '2006-03-01',
          region: conn.dataSource.s3Region,
          endpoint: conn.dataSource.s3Endpoint,
          credentials: {
            accessKeyId: conn.dataSource.s3Key,
            secretAccessKey: conn.dataSource.s3Secret,
          },
        });

        const bucketName = conn.dataSource.s3Bucket;
        const data_source_id = conn.dataSource.id;

        if (repos.length > 0) {
          await this.addRepoToS3(s3, bucketName, data_source_id, repos);
        }

        if (issues.length > 0) {
          await this.addIssuesToS3(s3, bucketName, data_source_id, issues);
        }

        if (prs.length > 0) {
          await this.addPullRequestsToS3(s3, bucketName, data_source_id, prs);
        }
      }

      await this.prisma.dataSourceConnections.update({
        where: { id: conn.id },
        data: {
          lastSyncAt: new Date(),
        },
      });
    }

    this.logger.log('Data sync completed for user ' + userId);
  }

  private async getIssues(
    accessToken: string,
    repos: Repository[],
  ): Promise<Issues[]> {
    const issuePromises = repos
      .filter((r) => r.has_issues)
      .map((r) => this.githubService.getIssues(accessToken, r.url, r.id));

    const issuesArrays = await Promise.all(issuePromises);
    return issuesArrays.flat();
  }

  private async getPullRequests(
    accessToken: string,
    repos: Repository[],
  ): Promise<PullRequest[]> {
    const pullRequests = repos.map((r) =>
      this.githubService.getPullRequests(accessToken, r.url, r.id),
    );

    return (await Promise.all(pullRequests)).flat();
  }

  private async addRepoToPg(drizzle: NodePgDatabase<any>, repos: Repository[]) {
    this.logger.log(`Adding ${repos.length} repos to database`);
    let promiseArray = [];

    for (const r of repos) {
      promiseArray.push(
        drizzle
          .insert(Repo)
          .values(r)
          .onConflictDoUpdate({
            target: Repo.id,
            set: r,
          })
          .catch((err) => {
            console.error('Error inserting repo', err);
            this.logger.error('Error inserting repo ' + r.id, err);
          }),
      );
    }

    await Promise.all(promiseArray);
  }

  private async addPullRequests(
    drizzle: NodePgDatabase<any>,
    prs: PullRequest[],
  ) {
    this.logger.log(`Adding ${prs.length} pull requests to database`);
    let promiseArray = [];

    for (const pr of prs) {
      promiseArray.push(
        drizzle
          .insert(PR)
          .values(pr)
          .onConflictDoUpdate({
            target: PR.id,
            set: pr,
          })
          .catch((err) => {
            console.error('Error inserting pr', err);
            this.logger.error('Error inserting pr ' + pr.id, err);
          }),
      );
    }
  }

  private async addIssues(drizzle: NodePgDatabase<any>, issues: Issues[]) {
    this.logger.log(`Adding ${issues.length} issues to database`);
    let promiseArray = [];

    for (const i of issues) {
      promiseArray.push(
        drizzle
          .insert(Iss)
          .values(i)
          .onConflictDoUpdate({
            target: Iss.id,
            set: i,
          })
          .catch((err) => {
            console.error('Error inserting issue', err);
            this.logger.error('Error inserting issue ' + i.id, err);
          }),
      );
    }

    await Promise.all(promiseArray);
  }

  private async addRepoToS3(
    s3: S3,
    bucketName: string,
    data_source_id: string,
    repos: Repository[],
  ) {
    this.logger.log(`Adding ${repos.length} repos to S3`);
    const key = `github/${data_source_id}_repositories.json`;
    const body = JSON.stringify(repos);
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: 'application/json',
      });
    } catch (err) {
      this.logger.error('Error uploading repo ', err);
    }
  }

  private async addPullRequestsToS3(
    s3: S3,
    bucketName: string,
    data_source_id: string,
    prs: PullRequest[],
  ) {
    this.logger.log(`Adding ${prs.length} pull requests to S3`);
    const key = `github/${data_source_id}_pull_requests.json`;
    const body = JSON.stringify(prs);
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: 'application/json',
      });
    } catch (err) {
      this.logger.error('Error uploading pull request ', err);
    }
  }

  private async addIssuesToS3(
    s3: S3,
    bucketName: string,
    data_source_id: string,
    issues: Issues[],
  ) {
    this.logger.log(`Adding ${issues.length} issues to S3`);
    const key = `github/${data_source_id}_issues.json`;
    const body = JSON.stringify(issues);
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: key,
        Body: body,
        ContentType: 'application/json',
      });
    } catch (err) {
      this.logger.error('Error uploading issue ', err);
    }
  }
}
