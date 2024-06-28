import { Issues, PullRequests, Repository } from './schema';

export type Repo = typeof Repository.$inferInsert;
export type Issue = typeof Issues.$inferInsert;
export type PullRequest = typeof PullRequests.$inferInsert;
