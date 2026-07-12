import Link from "next/link";
import { Stethoscope, Mail, Phone } from "lucide-react";
import { FOOTER_LINKS, MEDICAL_DISCLAIMER, SITE } from "@/lib/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto" role="contentinfo">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <Stethoscope className="h-6 w-6" aria-hidden="true" />
              {SITE.name}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">{SITE.description}</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="h-4 w-4" aria-hidden="true" /> {SITE.email}
              </a>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" /> {SITE.phone}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">{MEDICAL_DISCLAIMER}</p>
        <p className="text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
