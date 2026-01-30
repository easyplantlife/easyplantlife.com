import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books | Easy Plant Life",
  description: "Explore our collection of books about living with plants.",
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-heading text-4xl font-semibold text-text sm:text-5xl">
          Books
        </h1>
        <p className="mt-6 text-lg text-text-secondary">
          Explore our collection of books about living with plants.
        </p>
      </div>
    </main>
  );
}
