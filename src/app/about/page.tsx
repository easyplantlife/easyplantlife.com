import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Easy Plant Life",
  description: "Learn about Easy Plant Life and our calm approach to living with plants.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
          About
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          A calm approach to living with plants.
        </p>
      </div>
    </main>
  );
}
