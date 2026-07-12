import Link from "next/link";
import { getAllTeamMembers } from "@/lib/team";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata(
  {
    title: "Medical Team",
    description: `Meet the physicians and health experts who write and review content on ${SITE.name}.`,
  },
  "/medical-team"
);

export default function MedicalTeamPage() {
  const members = getAllTeamMembers();

  return (
    <div className="container-custom py-8">
      <Breadcrumb items={[{ label: "Medical Team", href: "/medical-team" }]} />
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Medical Team</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {SITE.name} content is written and reviewed by named healthcare professionals. Each medicine,
          disease, and health article lists its author and medical reviewer so you know who stands behind the
          information.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <Link
            key={member.id}
            href={`/medical-team/${member.slug}`}
            className="rounded-xl border p-6 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
            <p className="text-sm text-primary font-medium mb-3">{member.credentials}</p>
            <p className="text-sm text-muted-foreground line-clamp-3">{member.bio}</p>
            <span className="inline-block mt-4 text-sm text-primary font-medium">View profile →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
