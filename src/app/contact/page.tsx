import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ContactContent } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact | Easy Plant Life",
  description: "Get in touch with Easy Plant Life.",
};

/**
 * Contact Page
 *
 * A minimal contact page with a simple message and contact form.
 *
 * Design principles:
 * - Minimal, focused design
 * - Calm, honest tone per brand guidelines
 * - No social links required
 * - Contact form prominently displayed
 */
export default function ContactPage() {
  return (
    <PageLayout title="Contact">
      <ContactContent />
    </PageLayout>
  );
}
