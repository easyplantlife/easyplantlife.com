import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter | Easy Plant Life",
  description: "Subscribe to our newsletter for plant tips and updates.",
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
          Newsletter
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Subscribe to our newsletter for plant tips and updates.
        </p>
      </div>
    </main>
  );
}
