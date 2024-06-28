import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Issues } from 'src/interfaces/Issue.interface';
import { PullRequest } from 'src/interfaces/PullRequest.interface';
import { Repository } from 'src/interfaces/Repository.interface';

@Injectable()
export class GithubService {
  constructor() {}

  async getRepositories(accessToken: string): Promise<Repository[]> {
    const url = 'https://api.github.com/user/repos';
    const res = await axios.get(url, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return res.data.map((repo: any) => {
      return repo as Repository;
    });
  }

  async getIssues(
    accessToken: string,
    url: string,
    repository_id: number,
  ): Promise<Issues[]> {
    const res = await axios.get(`${url}/issues`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return res.data.map((issue: any) => {
      const newIssue = issue as Issues;
      newIssue.repository_id = repository_id;
      return newIssue;
    });
  }

  async getPullRequests(
    accessToken: string,
    url: string,
    repository_id: number,
  ): Promise<PullRequest[]> {
    const res = await axios.get(`${url}/pulls`, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return res.data.map((pr: any) => {
      const newPr = pr as PullRequest;
      newPr.repository_id = repository_id;
      return newPr;
    });
  }
}
