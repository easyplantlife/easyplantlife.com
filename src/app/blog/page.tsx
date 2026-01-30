import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Easy Plant Life",
  description:
    "Read our latest articles about plant care and living with plants.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
          Blog
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Read our latest articles about plant care and living with plants.
        </p>
      </div>
    </main>
  );
}
