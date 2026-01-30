import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ContactContent } from "@/components/contact";

export const metadata: Metadata = {
  title: "Contact | Easy Plant Life",
  description:
    "Have a question or want to say hello? Get in touch with Easy Plant Life through our simple contact form.",
  openGraph: {
    title: "Contact | Easy Plant Life",
    description:
      "Have a question or want to say hello? Reach out to Easy Plant Life—we'd love to hear from you.",
    type: "website",
    siteName: "Easy Plant Life",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Easy Plant Life",
    description:
      "Have a question or want to say hello? Get in touch with Easy Plant Life.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
