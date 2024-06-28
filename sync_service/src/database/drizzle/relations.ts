import { relations } from 'drizzle-orm/relations';
import { Issues, PullRequests, Repository } from './schema';

export const PullRequestsRelations = relations(PullRequests, ({ one }) => ({
  Repository: one(Repository, {
    fields: [PullRequests.repository_id],
    references: [Repository.id],
  }),
}));

export const RepositoryRelations = relations(Repository, ({ many }) => ({
  PullRequests: many(PullRequests),
  Issues: many(Issues),
}));

export const IssuesRelations = relations(Issues, ({ one }) => ({
  Repository: one(Repository, {
    fields: [Issues.repository_id],
    references: [Repository.id],
  }),
}));
