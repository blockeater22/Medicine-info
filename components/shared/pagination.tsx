"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listingPageHref } from "@/lib/listings";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={listingPageHref(basePath, currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        </Button>
      )}
      {pages.map((page, i) => {
        const prev = pages[i - 1];
        const showEllipsis = prev && page - prev > 1;
        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
            <Link
              href={listingPageHref(basePath, page)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                page === currentPage ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          </span>
        );
      })}
      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={listingPageHref(basePath, currentPage + 1)}>
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </nav>
  );
}
