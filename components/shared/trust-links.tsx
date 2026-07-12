import Link from "next/link";
import { TRUST_HUB_LINKS } from "@/lib/trust-pages";

export { TRUST_HUB_LINKS } from "@/lib/trust-pages";

export function TrustLinksGrid({ excludeHref }: { excludeHref?: string }) {
  const links = TRUST_HUB_LINKS.filter((l) => l.href !== excludeHref);

  return (
    <nav aria-label="Trust and policies" className="grid sm:grid-cols-2 gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-primary hover:underline rounded-lg border px-3 py-2 bg-muted/20"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
