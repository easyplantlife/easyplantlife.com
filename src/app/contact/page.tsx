import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Easy Plant Life",
  description: "Get in touch with Easy Plant Life.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
          Contact
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Get in touch with us.
        </p>
      </div>
    </main>
  );
}
