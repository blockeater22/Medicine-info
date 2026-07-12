import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <p className="text-6xl font-bold text-primary mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/"><Home className="h-4 w-4" /> Go Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search"><Search className="h-4 w-4" /> Search</Link>
        </Button>
      </div>
    </div>
  );
}
