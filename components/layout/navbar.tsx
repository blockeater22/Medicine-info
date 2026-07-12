"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Stethoscope, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/search-bar";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container-custom flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary shrink-0"
          aria-label={`${SITE.name} home`}
        >
          <Stethoscope className="h-6 w-6" aria-hidden="true" />
          <span className="hidden sm:inline">{SITE.name}</span>
        </Link>

        {pathname !== "/" && (
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <SearchBar compact />
          </div>
        )}

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent",
                pathname.startsWith(link.href) && "bg-primary text-primary-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          <SearchBar compact />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent",
                pathname.startsWith(link.href) && "bg-primary text-primary-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
