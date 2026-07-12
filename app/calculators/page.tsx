import Link from "next/link";
import { Calculator } from "lucide-react";
import { getAllCalculators } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TopBannerAd } from "@/components/ads/ad-placeholder";

export const metadata = buildMetadata({
  title: "Medical Calculators — BMI, BMR, Pregnancy & More",
  description: "Free online medical calculators — BMI, BMR, calorie, pregnancy due date, ovulation, and more.",
  keywords: ["medical calculator", "BMI calculator", "health calculator"],
}, "/calculators");

export default function CalculatorsPage() {
  const calculators = getAllCalculators().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "Calculators", href: "/calculators" }]} />
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Medical Calculators</h1>
        <p className="text-muted-foreground text-lg">Free, instant, client-side health calculators for personal use.</p>
      </header>

      <TopBannerAd />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {calculators.map((calc) => (
          <Link key={calc.slug} href={`/calculator/${calc.slug}`} className="group flex items-start gap-4 rounded-xl border p-5 hover:border-primary/30 hover:shadow-sm transition-all">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold group-hover:text-primary transition-colors">{calc.name}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{calc.description}</p>
              <span className="text-xs text-primary mt-2 inline-block">{calc.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
