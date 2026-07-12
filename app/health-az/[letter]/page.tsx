import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { getHealthAzEntries } from "@/lib/categories";

const VALID = new Set("abcdefghijklmnopqrstuvwxyz".split(""));

export async function generateStaticParams() {
  return "abcdefghijklmnopqrstuvwxyz".split("").map((letter) => ({ letter }));
}

export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const upper = letter.toUpperCase();
  return buildMetadata(
    {
      title: `Health A–Z: ${upper} | Doctors Hub`,
      description: `Medicines, diseases, and lab tests starting with ${upper}.`,
      keywords: [`health ${upper}`, "medical index"],
    },
    `/health-az/${letter}`
  );
}

export default async function HealthAzLetterPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  if (!VALID.has(letter)) notFound();

  const entries = getHealthAzEntries(letter);
  const upper = letter.toUpperCase();

  return (
    <div className="container-custom py-8">
      <Breadcrumb
        items={[
          { label: "Health A–Z", href: "/health-az" },
          { label: upper, href: `/health-az/${letter}` },
        ]}
      />
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{upper}</h1>
        <p className="text-muted-foreground mt-1">{entries.length} entries</p>
      </header>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">No entries yet for this letter.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {entries.map((e) => (
            <li key={`${e.type}-${e.href}`}>
              <Link href={e.href} className="flex items-center justify-between px-4 py-3 hover:bg-muted/50">
                <span className="font-medium">{e.name}</span>
                <span className="text-xs text-muted-foreground">{e.type}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm">
        <Link href="/health-az" className="text-primary hover:underline">
          ← Back to A–Z index
        </Link>
      </p>
    </div>
  );
}
