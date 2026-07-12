import type { ContentReviewInfo } from "@/types";

export const DEFAULT_CONTENT_REVIEW: ContentReviewInfo = {
  lastReviewed: "2026-07-12",
};

export function resolveContentReview(
  contentReview?: ContentReviewInfo,
  updatedAt?: string
): ContentReviewInfo {
  if (contentReview?.lastReviewed) return contentReview;
  if (updatedAt) return { lastReviewed: updatedAt.slice(0, 10) };
  return DEFAULT_CONTENT_REVIEW;
}

/** @deprecated Use resolveContentReview */
export function resolveAuthorship(contentReview?: ContentReviewInfo, updatedAt?: string): ContentReviewInfo {
  return resolveContentReview(contentReview, updatedAt);
}
