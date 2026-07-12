"use client";

import { useReadingProgress } from "@/hooks/use-reading-progress";

export function ReadingProgressBar() {
  const progress = useReadingProgress();
  if (progress <= 0) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-primary transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
