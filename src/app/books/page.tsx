import type { Metadata } from "next";
import { PageLayout } from "@/components/PageLayout";
import { BooksList } from "@/components/books/BooksList";
import { BookJsonLd } from "@/components/seo/JsonLd";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Panel } from "@/components/ui/Panel";
import { Text } from "@/components/ui/Text";
import { books } from "@/content/books";

export const metadata: Metadata = {
  title: "Books | Easy Plant Life",
  description: "Explore our collection of books about living with plants.",
};

export default function BooksPage() {
  return (
    <PageLayout
      eyebrow="Books"
      title="Two short books about the same idea."
      lead="One is practical, one is a story. Both are about making plant-based eating fit real life instead of running it. Both are on Amazon."
    >
      {books.map((book) => (
        <BookJsonLd key={book.id} book={book} />
      ))}

      <BooksList books={books} data-testid="books-list" />

      <Panel
        as="aside"
        columns
        aria-labelledby="where-to-start"
        data-testid="books-intro"
        className="mt-14"
      >
        <div className="flex flex-col gap-2">
          <p
            id="where-to-start"
            className="font-serif text-[22px] font-medium leading-snug text-ink"
          >
            Not sure where to start?
          </p>
          <Text color="secondary">
            If you want something you can use this week, start with the
            Playbook. If you would rather see the idea play out in
            someone&apos;s life first, start with The Normal Vegan.
          </Text>
        </div>
        <div className="flex flex-col gap-2">
          <Text color="secondary">
            Prefer shorter reading? The blog covers the same ground in short
            pieces.
          </Text>
          <ArrowLink href="/blog">Read the blog</ArrowLink>
        </div>
      </Panel>
    </PageLayout>
  );
}
