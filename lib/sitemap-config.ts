/** Split into multiple sitemap files when URL count exceeds this (Google limit: 50,000). */
export const SITEMAP_CHUNK_SIZE = 5_000;

/** Block common AI training/scraping crawlers; search engines remain allowed. */
export const AI_CRAWLER_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Google-Extended",
  "ClaudeBot",
  "anthropic-ai",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "FacebookBot",
  "Applebot-Extended",
] as const;
