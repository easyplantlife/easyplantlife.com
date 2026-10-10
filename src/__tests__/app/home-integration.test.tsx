import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";
import { getAllPosts } from "@/lib/blog/posts";
import { trackNewsletterSubmit } from "@/lib/analytics/events";

jest.mock("@/lib/blog/posts", () => ({
  getAllPosts: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>;
const mockFetch = jest.fn();
global.fetch = mockFetch;

function renderHome() {
  return render(<Home />);
}

async function subscribe(email: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Email address"), email);
  await user.click(screen.getByRole("button", { name: "Get the notes" }));
  return user;
}

/**
 * Home page integration: the real Hero, newsletter form and data flow
 * working together, with only the network mocked.
 */
describe("Home Page Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockGetAllPosts.mockReset();
    mockGetAllPosts.mockReturnValue([
      {
        slug: "default-meals",
        title: "Default meals",
        excerpt: "Why a boring default is the whole trick.",
        url: "/blog/default-meals",
        publishedDate: new Date("2026-03-01"),
      },
    ]);
    jest.mocked(trackNewsletterSubmit).mockClear();
  });

  describe("First impression", () => {
    it("communicates the brand in the hero without a logo image as h1", async () => {
      await renderHome();
      const hero = screen.getByTestId("hero-section");
      expect(within(hero).getByRole("heading", { level: 1 })).toHaveTextContent(
        /without turning it into a project/i
      );
      expect(within(hero).getByText("Easy Plant Life")).toBeInTheDocument();
    });

    it("places the primary action above the writing and the books", async () => {
      await renderHome();
      const form = screen.getByRole("form", { name: /newsletter/i });
      const writing = screen.getByTestId("recent-writing");
      expect(
        form.compareDocumentPosition(writing) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    });
  });

  describe("Newsletter flow", () => {
    it("validates before calling the API", async () => {
      await renderHome();
      await subscribe("nope");
      expect(await screen.findByTestId("newsletter-error")).toBeInTheDocument();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("sends the address and replaces the form with the success note", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      await renderHome();
      await subscribe("jo@example.com");

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
      expect(
        screen.queryByRole("form", { name: /newsletter/i })
      ).not.toBeInTheDocument();
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body).toEqual({ email: "jo@example.com" });
      expect(trackNewsletterSubmit).toHaveBeenCalledWith("success");
    });

    it("lets the visitor start over after success", async () => {
      mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      await renderHome();
      const user = await subscribe("jo@example.com");
      await screen.findByTestId("newsletter-success");

      await user.click(
        screen.getByRole("button", { name: /use a different address/i })
      );
      expect(screen.getByLabelText("Email address")).toHaveValue("");
    });

    it("keeps the form and shows an error when the API fails", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Service unavailable" }),
      });
      await renderHome();
      await subscribe("jo@example.com");

      expect(await screen.findByTestId("newsletter-error")).toHaveTextContent(
        /something went wrong/i
      );
      expect(
        screen.getByRole("form", { name: /newsletter/i })
      ).toBeInTheDocument();
      expect(trackNewsletterSubmit).toHaveBeenCalledWith("error");
    });

    it("clears the error once the visitor edits the address", async () => {
      await renderHome();
      const user = await subscribe("nope");
      await screen.findByTestId("newsletter-error");
      await user.type(screen.getByLabelText("Email address"), "x");
      expect(screen.queryByTestId("newsletter-error")).not.toBeInTheDocument();
    });
  });

  describe("Navigation out of the page", () => {
    it("links to the blog, the books and the about page", async () => {
      await renderHome();
      expect(
        screen.getByRole("link", { name: "Read the blog" })
      ).toHaveAttribute("href", "/blog");
      expect(
        screen.getByRole("link", { name: "See the books" })
      ).toHaveAttribute("href", "/books");
      expect(screen.getByRole("link", { name: "All posts" })).toHaveAttribute(
        "href",
        "/blog"
      );
      expect(
        screen.getByRole("link", { name: "More about why this exists" })
      ).toHaveAttribute("href", "/about");
    });

    it("keeps posts on the site and opens Amazon in a new tab", async () => {
      await renderHome();
      const readLink = screen.getByRole("link", {
        name: 'Read "Default meals"',
      });
      expect(readLink).toHaveAttribute("href", "/blog/default-meals");
      expect(readLink).not.toHaveAttribute("target");

      const external = screen.getAllByRole("link", { name: /buy on amazon/i });
      expect(external.length).toBeGreaterThan(0);
      for (const link of external) {
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    });
  });
});
