import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { ContactContent } from "@/components/contact";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Have a question or want to say hello? Write to Easy Plant Life through a simple contact form.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageLayout>
      <ContactContent />
    </PageLayout>
  );
}
