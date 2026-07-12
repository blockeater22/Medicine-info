import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata(
  {
    title: "Redirect — Medical Disclaimer",
    description: "This page has moved to Medical Disclaimer.",
    noindex: true,
  },
  "/disclaimer"
);

export default function DisclaimerRedirectPage() {
  return (
    <div className="container-custom py-16 text-center space-y-4">
      <p className="text-muted-foreground">This page has moved.</p>
      <Link href="/medical-disclaimer" className="text-primary hover:underline font-medium">
        Go to Medical Disclaimer →
      </Link>
    </div>
  );
}
