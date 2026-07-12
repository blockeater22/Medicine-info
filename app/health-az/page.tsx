import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const metadata = buildMetadata(
  {
    title: "Health A–Z Index | Doctors Hub",
    description: "Alphabetical index of medicines, diseases, and lab tests on Doctors Hub.",
    keywords: ["health A-Z", "medical index", "medicines diseases lab tests"],
  },
  "/health-az"
);

export default function HealthAzPage() {
  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "Health A–Z", href: "/health-az" }]} />
      <header className="mb-8 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Health A–Z</h1>
        <p className="text-lg text-muted-foreground">
          Jump to medicines, diseases, and lab tests by first letter.
        </p>
      </header>
      <nav aria-label="Alphabetical index" className="flex flex-wrap gap-2">
        {LETTERS.map((letter) => (
          <Link
            key={letter}
            href={`/health-az/${letter.toLowerCase()}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border font-medium hover:bg-muted"
          >
            {letter}
          </Link>
        ))}
      </nav>
    </div>
  );
}
