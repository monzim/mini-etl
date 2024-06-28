export class PullRequest {
  url: string;
  id: number;
  node_id: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: {};
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: null;
  merged_at: null;
  merge_commit_sha: string;
  assignee: null;
  assignees: any[];
  requested_reviewers: any[];
  requested_teams: any[];
  milestone: null;
  draft: boolean;
  head: {};
  base: {};
  author_association: string;
  auto_merge: null;
  active_lock_reason: null;
  repository_id: number;
}
