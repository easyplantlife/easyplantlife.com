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

/**
 * Represents a book in the Easy Plant Life collection.
 *
 * @property id - Unique identifier for the book
 * @property title - Book title
 * @property description - Brief description of the book content
 * @property coverImage - Path to cover image (relative to /public)
 * @property status - Availability status: "available" for purchase or "coming-soon"
 * @property purchaseLinks - Array of purchase link options (Amazon, etc.)
 */
export interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  status: "available" | "coming-soon";
  purchaseLinks: PurchaseLink[];
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
    id: "easy-plant-life-guide",
    title: "The Easy Plant Life Guide",
    description:
      "A gentle introduction to bringing plants into your home. No pressure, no complicated care schedules—just simple, honest advice for living with plants.",
    coverImage: "/images/books/easy-plant-life-guide.svg",
    status: "coming-soon",
    purchaseLinks: [],
  },
];
