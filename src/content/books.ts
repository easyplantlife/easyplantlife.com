/**
 * Book Data Model
 *
 * Defines the structure for book content and provides static book data.
 * Books are static content for MVP - no CMS integration needed.
 */

/**
 * Represents a purchase link for a book.
 */
export interface PurchaseLink {
  label: string;
  url: string;
}

export type BookStatus = "available" | "coming-soon";

/**
 * Represents a book in the Easy Plant Life collection.
 *
 * @property id - Unique identifier for the book
 * @property title - Book title
 * @property tagline - Two or three words that say what kind of book it is
 * @property description - Brief description of the book content
 * @property coverImage - Path to cover image (relative to /public)
 * @property status - Availability status: "available" for purchase or "coming-soon"
 * @property pages - Page count, when known
 * @property purchaseLinks - Array of purchase link options (Amazon, etc.)
 */
export interface Book {
  id: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  status: BookStatus;
  pages?: number;
  purchaseLinks: PurchaseLink[];
}

const statusLabels: Record<BookStatus, string> = {
  available: "Available now",
  "coming-soon": "Coming soon",
};

/** Human label for a book's availability. */
export function getBookStatusLabel(status: BookStatus): string {
  return statusLabels[status];
}

/**
 * Static book data for Easy Plant Life.
 *
 * To add a new book:
 * 1. Add cover image to /public/images/books/
 * 2. Add book entry to this array
 * 3. Set status to "coming-soon" until available
 */
export const books: Book[] = [
  {
    id: "easy-plant-life-the-everyday-vegan-playbook",
    title: "The Everyday Vegan Playbook",
    tagline: "The practical one",
    description:
      "Not a cookbook or a manifesto. A calm guide to building simple default meals and systems so vegan eating fits naturally into busy, imperfect days. No constant planning, recipes, or willpower.",
    coverImage: "/images/books/easy-plant-life-the-everyday-vegan-playbook.png",
    status: "available",
    pages: 76,
    purchaseLinks: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/B0GL118S83",
      },
    ],
  },
  {
    id: "easy-plant-life-the-normal-vegan",
    title: "The Normal Vegan",
    tagline: "The story",
    description:
      "A story about eating without effort. Follow Maya, a remote software engineer, as she discovers that the problem was not veganism itself. It was friction. No rules, no meal plans, no pressure. Just a gentle reframing of how food can fit into real life.",
    coverImage: "/images/books/easy-plant-life-the-normal-vegan.png",
    status: "available",
    pages: 125,
    purchaseLinks: [
      {
        label: "Buy on Amazon",
        url: "https://www.amazon.com/dp/B0GLGFYLTZ",
      },
    ],
  },
];
