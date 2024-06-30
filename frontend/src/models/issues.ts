export interface Issues {
  url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {};
  labels: {}[];
  state: string;
  locked: boolean;
  assignee: null;
  assignees: any[];
  milestone: null;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: null;
  author_association: string;
  active_lock_reason: null;
  draft: boolean;
  pull_request: {};
  body: string;
  reactions: {};
  performed_via_github_app: null;
  state_reason: null;
  repository_id: number;
}
