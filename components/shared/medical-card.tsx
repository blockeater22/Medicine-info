import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MedicalCardProps {
  title: string;
  description: string;
  href: string;
  category?: string;
  badge?: string;
  className?: string;
}

export function MedicalCard({ title, description, href, category, badge, className }: MedicalCardProps) {
  return (
    <Link href={href} className={cn("group block", className)}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base group-hover:text-primary transition-colors line-clamp-2">{title}</CardTitle>
            {badge && (
              <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">{badge}</span>
            )}
          </div>
          {category && <p className="text-xs text-muted-foreground">{category}</p>}
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-2 mb-3">{description}</CardDescription>
          <span className="inline-flex items-center text-sm font-medium text-primary">
            Read more <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
