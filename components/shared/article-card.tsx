import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/utils/helpers";

interface ArticleCardProps {
  title: string;
  description: string;
  href: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: number;
}

export function ArticleCard({ title, description, href, category, author, publishedAt, readTime }: ArticleCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/30">
        <CardHeader className="pb-3">
          <span className="text-xs font-medium text-primary">{category}</span>
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 mb-4">{description}</CardDescription>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="h-3 w-3" />{author}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{readTime} min read</span>
            <span>{formatDate(publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
