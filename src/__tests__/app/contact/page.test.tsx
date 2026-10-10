import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";
import { siteConfig } from "@/content/site";

jest.mock("@/components/forms/ContactForm", () => ({
  ContactForm: ({ className }: { className?: string }) => (
    <div data-testid="contact-form" className={className}>
      Mocked Contact Form
    </div>
  ),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

/**
 * Contact Page
 *
 * PageLayout without an intro; ContactContent supplies the h1, a short
 * invitation, the plain email address and the form.
 */
describe("Contact Page", () => {
  describe("Layout", () => {
    it("renders the h1 from ContactContent inside a single main", () => {
      render(<ContactPage />);
      expect(screen.getAllByRole("main")).toHaveLength(1);
      const h1s = screen.getAllByRole("heading", { level: 1 });
      expect(h1s).toHaveLength(1);
      expect(h1s[0]).toHaveTextContent("Say hello.");
    });

    it("renders the eyebrow", () => {
      render(<ContactPage />);
      expect(screen.getByText("Contact")).toBeInTheDocument();
    });

    it("renders the ContactContent block with the form", () => {
      render(<ContactPage />);
      const content = screen.getByTestId("contact-content");
      expect(content).toContainElement(screen.getByTestId("contact-form"));
    });
  });

  describe("Invitation", () => {
    it("keeps the invitation short", () => {
      render(<ContactPage />);
      const text = screen.getByText(/questions about the books/i).textContent!;
      expect(text.split(/\.\s+/).length).toBeLessThanOrEqual(2);
    });

    it("offers the plain email address as a mailto link", () => {
      render(<ContactPage />);
      const link = screen.getByRole("link", { name: siteConfig.contactEmail });
      expect(link).toHaveAttribute("href", `mailto:${siteConfig.contactEmail}`);
    });

    it("says a person reads the messages and there is no hidden signup", () => {
      render(<ContactPage />);
      expect(screen.getByText(/read by a person/i)).toBeInTheDocument();
      expect(
        screen.getByText(/no newsletter signup hidden/i)
      ).toBeInTheDocument();
    });
  });

  describe("Brand compliance", () => {
    it("contains no hype language", () => {
      render(<ContactPage />);
      const text = document.body.textContent?.toLowerCase() ?? "";
      for (const phrase of [
        "don't miss",
        "limited time",
        "exclusive",
        "amazing",
      ]) {
        expect(text).not.toContain(phrase);
      }
    });

    it("does not display social links", () => {
      render(<ContactPage />);
      for (const host of [
        "instagram.com",
        "facebook.com",
        "twitter.com",
        "x.com",
        "tiktok.com",
      ]) {
        expect(document.querySelector(`a[href*="${host}"]`)).toBeNull();
      }
    });
  });
});
