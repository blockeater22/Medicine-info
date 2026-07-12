"use client";

import { Activity } from "lucide-react";

export function NewsletterSection() {
  return (
    <section className="section-padding">
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-8 md:p-12 text-center">
        <Activity className="h-8 w-8 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Stay Informed About Your Health</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Get the latest health tips, medicine updates, and wellness guides delivered to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" className="flex-1 h-11 rounded-xl border px-4 text-sm bg-background" aria-label="Email for newsletter" />
          <button type="submit" className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
