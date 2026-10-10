/**
 * Page Routes Tests
 *
 * Every public route renders without error, exposes metadata with a title,
 * and has a single h1.
 */

import { render, screen } from "@testing-library/react";

jest.mock("next/font/local", () => ({
  __esModule: true,
  default: (options: { variable: string }) => ({
    variable: options.variable,
    className: `mock-${options.variable.replace("--font-", "")}`,
  }),
}));

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn().mockResolvedValue([
    {
      id: "test123",
      title: "Test Blog Post",
      excerpt: "Test excerpt for blog post.",
      url: "https://medium.com/@test/test-post",
      publishedDate: new Date("2024-01-15"),
    },
  ]),
}));

const routes = [
  {
    path: "/",
    load: () => import("@/app/page"),
    async: true,
    h1: /living vegan without turning it into a project/i,
    title: /easy plant life/i,
  },
  {
    path: "/about",
    load: () => import("@/app/about/page"),
    async: false,
    h1: /does not need to feel like a project/i,
    title: /about/i,
  },
  {
    path: "/books",
    load: () => import("@/app/books/page"),
    async: false,
    h1: /two short books/i,
    title: /books/i,
  },
  {
    path: "/blog",
    load: () => import("@/app/blog/page"),
    async: true,
    h1: /short pieces/i,
    title: /blog/i,
  },
  {
    path: "/newsletter",
    load: () => import("@/app/newsletter/page"),
    async: false,
    h1: /occasional notes/i,
    title: /newsletter/i,
  },
  {
    path: "/contact",
    load: () => import("@/app/contact/page"),
    async: false,
    h1: /say hello/i,
    title: /contact/i,
  },
] as const;

describe("Page Routes", () => {
  describe.each(routes)("$path", (route) => {
    it("renders without error with a single h1", async () => {
      const mod = await route.load();
      const Page = mod.default as () =>
        React.ReactElement | Promise<React.ReactElement>;
      const element = route.async ? await Page() : <Page />;
      render(element);
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent(route.h1);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("exports metadata with a title", async () => {
      const { metadata } = await route.load();
      expect(metadata).toBeDefined();
      expect(String(metadata.title)).toMatch(route.title);
    });
  });

  describe("Not found", () => {
    it("renders the 404 page with a way home", async () => {
      const NotFound = (await import("@/app/not-found")).default;
      render(<NotFound />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        /nothing here/i
      );
      expect(
        screen.getByRole("link", { name: /back to the home page/i })
      ).toHaveAttribute("href", "/");
    });
  });
});
