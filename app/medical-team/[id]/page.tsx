import { notFound } from "next/navigation";
import { getAllTeamMembers, getTeamMember } from "@/lib/team";
import { buildMetadata, personSchema, JsonLd } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export function generateStaticParams() {
  return getAllTeamMembers().map((m) => ({ id: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) return {};
  return buildMetadata(member.seo, `/medical-team/${id}`);
}

export default async function MedicalTeamProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) notFound();

  return (
    <div className="container-custom py-8 max-w-3xl">
      <JsonLd data={personSchema(member)} />
      <Breadcrumb
        items={[
          { label: "Medical Team", href: "/medical-team" },
          { label: member.name, href: `/medical-team/${member.slug}` },
        ]}
      />

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{member.name}</h1>
        <p className="text-lg text-primary font-medium">{member.credentials}</p>
        <p className="text-muted-foreground mt-1">{member.specialty}</p>
      </header>

      <div className="prose-medical space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <p className="leading-relaxed text-muted-foreground">{member.bio}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Registration</h2>
          <p className="text-muted-foreground">{member.registration}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Education</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {member.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Affiliations</h2>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            {member.affiliations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Languages</h2>
          <p className="text-muted-foreground">{member.languages.join(", ")}</p>
        </section>
      </div>
    </div>
  );
}
