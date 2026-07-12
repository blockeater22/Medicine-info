import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b5ba8" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
};
