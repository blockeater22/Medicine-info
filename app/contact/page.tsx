import { buildMetadata } from "@/lib/seo";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SITE } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "@/components/shared/contact-form";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: `Contact ${SITE.name} for questions, feedback, or content corrections.`,
}, "/contact");

export default function ContactPage() {
  return (
    <div className="container-custom py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "Contact", href: "/contact" }]} />
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="text-muted-foreground mb-8">Have a question, feedback, or found an error? We&apos;d love to hear from you.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <a href={`mailto:${SITE.email}`} className="flex items-center gap-3 rounded-xl border p-4 hover:border-primary/30 transition-colors">
            <Mail className="h-5 w-5 text-primary" />
            <div><p className="text-sm text-muted-foreground">Email</p><p className="font-medium">{SITE.email}</p></div>
          </a>
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <Phone className="h-5 w-5 text-primary" />
            <div><p className="text-sm text-muted-foreground">Phone</p><p className="font-medium">{SITE.phone}</p></div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div><p className="text-sm text-muted-foreground">Location</p><p className="font-medium">{SITE.address}</p></div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
