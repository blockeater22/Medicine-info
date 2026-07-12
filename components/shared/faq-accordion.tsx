import type { FAQItem } from "@/types";
import { faqSchema, JsonLd } from "@/lib/seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQAccordionProps {
  faqs: FAQItem[];
  title?: string;
}

export function FAQAccordion({ faqs, title = "Frequently Asked Questions" }: FAQAccordionProps) {
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="faq-heading">
      <JsonLd data={faqSchema(faqs)} />
      <h2 id="faq-heading" className="text-2xl font-semibold mb-6">{title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
