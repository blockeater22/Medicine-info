import type { AuthorshipInfo } from "@/types";

export const DEFAULT_AUTHORSHIP: AuthorshipInfo = {
  authorId: "dr-priya-sharma",
  reviewerId: "dr-rajesh-kumar",
  lastReviewed: "2026-07-12",
};

export const DEFAULT_ARTICLE_AUTHORSHIP: AuthorshipInfo = {
  authorId: "dr-priya-sharma",
  reviewerId: "dr-ananya-mehta",
  lastReviewed: "2026-07-12",
};

export function resolveAuthorship(authoredBy?: AuthorshipInfo): AuthorshipInfo {
  return authoredBy ?? DEFAULT_AUTHORSHIP;
}
