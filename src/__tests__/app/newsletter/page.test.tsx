import { render, screen } from "@testing-library/react";
import NewsletterPage from "@/app/newsletter/page";

jest.mock("@/components/forms/NewsletterForm", () => ({
  NewsletterForm: ({
    className,
    layout,
  }: {
    className?: string;
    layout?: string;
  }) => (
    <div
      data-testid="newsletter-form"
      className={className}
      data-layout={layout}
    >
      Mocked Newsletter Form
    </div>
  ),
}));

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

/**
 * Newsletter Page
 *
 * A narrow centered column: eyebrow, one-sentence promise, the form, and an
 * honest list of what arrives and what does not.
 */
describe("Newsletter Page", () => {
  describe("Intro", () => {
    it("renders the eyebrow, h1 and promise", () => {
      render(<NewsletterPage />);
      expect(screen.getByText("Newsletter")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Occasional notes on easy plant-based living."
      );
      expect(
        screen.getByText(/one email when there is something worth sharing/i)
      ).toBeInTheDocument();
    });

    it("keeps the promise to a few short sentences", () => {
      render(<NewsletterPage />);
      const lead = screen.getByText(
        /one email when there is something worth sharing/i
      );
      expect(lead.textContent!.split(/\.\s+/).length).toBeLessThanOrEqual(2);
    });

    it("uses a narrow centered layout", () => {
      render(<NewsletterPage />);
      const main = screen.getByRole("main");
      expect(main.firstElementChild?.className).toContain("max-w-narrow");
      expect(
        screen.getByRole("heading", { level: 1 }).parentElement?.parentElement
          ?.className
      ).toContain("text-center");
    });
  });

  describe("Form", () => {
    it("renders the stacked newsletter form", () => {
      render(<NewsletterPage />);
      const form = screen.getByTestId("newsletter-form");
      expect(form).toHaveAttribute("data-layout", "stacked");
      expect(form.className).toContain("max-w-");
    });
  });

  describe("Expectations", () => {
    it("lists what arrives and what does not", () => {
      render(<NewsletterPage />);
      expect(screen.getByText("What arrives")).toBeInTheDocument();
      expect(screen.getByText("What does not")).toBeInTheDocument();
      expect(
        screen.getByText(/new writing, when it is published/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/daily tips or challenges/i)).toBeInTheDocument();
    });
  });

  describe("Brand compliance", () => {
    it("contains no hype or frequency pressure language", () => {
      render(<NewsletterPage />);
      const text = document.body.textContent?.toLowerCase() ?? "";
      for (const phrase of [
        "don't miss",
        "limited time",
        "exclusive",
        "weekly",
        "every week",
        "join thousands",
        "free gift",
      ]) {
        expect(text).not.toContain(phrase);
      }
    });
  });

  describe("Accessibility", () => {
    it("has a single main landmark and a single h1", () => {
      render(<NewsletterPage />);
      expect(screen.getAllByRole("main")).toHaveLength(1);
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    });
  });
});
