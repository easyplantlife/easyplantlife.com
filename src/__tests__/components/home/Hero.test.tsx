import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Hero } from "@/components/home/Hero";
import { subscribeToNewsletter } from "@/lib/api/forms";

jest.mock("@/lib/api/forms", () => ({
  subscribeToNewsletter: jest.fn(),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

const mockSubscribe = subscribeToNewsletter as jest.MockedFunction<
  typeof subscribeToNewsletter
>;

/**
 * Hero
 *
 * One headline, one promise and the newsletter form, beside the books photo.
 * The hero is the only place on the home page that asks for anything.
 */
describe("Hero", () => {
  beforeEach(() => {
    mockSubscribe.mockReset();
  });

  describe("Structure", () => {
    it("renders a section labelled by its h1", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      expect(hero.tagName).toBe("SECTION");
      expect(hero).toHaveAttribute("aria-labelledby", "hero-title");
      expect(
        screen.getByRole("region", { name: /living vegan/i })
      ).toBeInTheDocument();
    });

    it("renders the brand eyebrow", () => {
      render(<Hero />);
      expect(screen.getByText("Easy Plant Life")).toBeInTheDocument();
    });

    it("renders the headline as the only h1", () => {
      render(<Hero />);
      const headings = screen.getAllByRole("heading", { level: 1 });
      expect(headings).toHaveLength(1);
      expect(headings[0]).toHaveTextContent(
        "Living vegan without turning it into a project."
      );
      expect(headings[0]).toHaveAttribute("id", "hero-title");
    });

    it("renders a short lead", () => {
      render(<Hero />);
      const lead = screen.getByTestId("hero-explanation");
      expect(lead).toHaveTextContent(/calm, practical writing/i);
      expect(lead.textContent?.split(/\.\s+/).length).toBeLessThanOrEqual(3);
    });

    it("does not render the lockup logo image or decorative dividers", () => {
      render(<Hero />);
      const images = document.querySelectorAll("img");
      expect(images).toHaveLength(1);
      expect(images[0]).not.toHaveAttribute(
        "src",
        expect.stringContaining("lockup")
      );
      expect(document.querySelector(".bg-gradient-to-r")).toBeNull();
    });
  });

  describe("Newsletter form", () => {
    it("renders an inline form with a hidden label", () => {
      render(<Hero />);
      const form = screen.getByRole("form", { name: /newsletter/i });
      const input = within(form).getByLabelText("Email address");
      expect(input).toHaveAttribute("type", "email");
      expect(screen.getByText("Email address").className).toContain("sr-only");
    });

    it("uses the calm call to action and help text", () => {
      render(<Hero />);
      expect(
        screen.getByRole("button", { name: "Get the notes" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Occasional notes. No schedule. Unsubscribe any time.")
      ).toBeInTheDocument();
    });

    it("submits the address and shows the success note", async () => {
      const user = userEvent.setup();
      mockSubscribe.mockResolvedValue();
      render(<Hero />);

      await user.type(screen.getByLabelText("Email address"), "jo@example.com");
      await user.click(screen.getByRole("button", { name: "Get the notes" }));

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
      expect(mockSubscribe).toHaveBeenCalledWith("jo@example.com");
      expect(screen.getByRole("status")).toHaveTextContent(/on the list/i);
    });

    it("shows an error for an invalid address without calling the API", async () => {
      const user = userEvent.setup();
      render(<Hero />);

      await user.type(screen.getByLabelText("Email address"), "not-an-email");
      await user.click(screen.getByRole("button", { name: "Get the notes" }));

      expect(await screen.findByRole("alert")).toHaveTextContent(
        /does not look like an email/i
      );
      expect(mockSubscribe).not.toHaveBeenCalled();
    });
  });

  describe("Links", () => {
    it("offers the blog and the books as secondary paths", () => {
      render(<Hero />);
      expect(
        screen.getByRole("link", { name: "Read the blog" })
      ).toHaveAttribute("href", "/blog");
      expect(
        screen.getByRole("link", { name: "See the books" })
      ).toHaveAttribute("href", "/books");
    });

    it("renders the books photo as a link to the books page", () => {
      render(<Hero />);
      const photoLink = screen.getByTestId("hero-books");
      expect(photoLink).toHaveAttribute("href", "/books");
      const img = within(photoLink).getByRole("img");
      expect(img).toHaveAttribute(
        "alt",
        expect.stringMatching(
          /the everyday vegan playbook and the normal vegan/i
        )
      );
    });
  });

  describe("Accessibility", () => {
    it("keyboard users reach the input, button and links in order", async () => {
      const user = userEvent.setup();
      render(<Hero />);

      await user.tab();
      expect(screen.getByLabelText("Email address")).toHaveFocus();
      await user.tab();
      expect(
        screen.getByRole("button", { name: "Get the notes" })
      ).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("link", { name: "Read the blog" })).toHaveFocus();
    });
  });
});
