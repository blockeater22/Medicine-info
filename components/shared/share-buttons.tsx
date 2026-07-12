"use client";

import { useState } from "react";
import { Copy, Check, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title, url: fullUrl });
    } else {
      copyLink();
    }
  };

  const printPage = () => window.print();

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={copyLink} aria-label="Copy link">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        {copied ? "Copied" : "Copy Link"}
      </Button>
      <Button variant="outline" size="sm" onClick={share} aria-label="Share">
        <Share2 className="h-4 w-4" /> Share
      </Button>
      <Button variant="outline" size="sm" onClick={printPage} aria-label="Print">
        <Printer className="h-4 w-4" /> Print
      </Button>
    </div>
  );
}
