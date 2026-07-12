import Link from "next/link";
import { getDiseaseSystemHref, getMedicineCategoryHref } from "@/lib/entity-hubs";

interface EntityHubLinksProps {
  type: "medicine" | "disease" | "symptom" | "lab-test";
  name: string;
  category?: string;
  drugClassHref?: string;
}

export function EntityHubLinks({ type, name, category, drugClassHref }: EntityHubLinksProps) {
  const letter = name.trim().charAt(0).toLowerCase();
  const categoryHref =
    category && type === "medicine"
      ? getMedicineCategoryHref(category)
      : category && type === "disease"
        ? getDiseaseSystemHref(category)
        : null;

  return (
    <nav aria-label="Explore related hubs" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      {categoryHref && (
        <Link href={categoryHref} className="text-primary hover:underline">
          Browse {category}
        </Link>
      )}
      {drugClassHref && (
        <Link href={drugClassHref} className="text-primary hover:underline">
          View drug class
        </Link>
      )}
      {letter >= "a" && letter <= "z" && (
        <Link href={`/health-az/${letter}`} className="text-primary hover:underline">
          Health A–Z: {letter.toUpperCase()}
        </Link>
      )}
      {type === "medicine" && (
        <Link href="/drug-classes" className="text-primary hover:underline">
          Drug classes
        </Link>
      )}
      {type === "symptom" && (
        <Link href="/diseases" className="text-primary hover:underline">
          Browse diseases
        </Link>
      )}
      {type === "lab-test" && (
        <Link href="/diseases" className="text-primary hover:underline">
          Conditions diagnosed by tests
        </Link>
      )}
    </nav>
  );
}
