import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterContent } from "@/components/newsletter";
import * as formsApi from "@/lib/api/forms";

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

jest.mock("@/lib/api/forms", () => ({
  subscribeToNewsletter: jest.fn(),
}));

describe("NewsletterContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders an article with the content test id", () => {
    render(<NewsletterContent />);
    const article = screen.getByTestId("newsletter-content");
    expect(article.tagName).toBe("ARTICLE");
  });

  it("does not render a page heading (PageLayout owns the intro)", () => {
    render(<NewsletterContent />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders the stacked signup form with a visible label", () => {
    render(<NewsletterContent />);
    expect(
      screen.getByRole("form", { name: /newsletter signup/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Email address").className).not.toContain(
      "sr-only"
    );
    expect(
      screen.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
  });

  it("lists what arrives and what does not", () => {
    render(<NewsletterContent />);
    expect(screen.getByText("What arrives")).toBeInTheDocument();
    expect(screen.getByText("What does not")).toBeInTheDocument();
    const lists = screen.getAllByRole("list");
    expect(lists).toHaveLength(2);
    expect(within(lists[0]).getAllByRole("listitem")).toHaveLength(3);
    expect(within(lists[1]).getAllByRole("listitem")).toHaveLength(3);
    expect(
      screen.getByText(/new writing, when it is published/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/daily tips or challenges/i)).toBeInTheDocument();
  });

  it("submits through the newsletter API and offers to read something", async () => {
    const user = userEvent.setup();
    (formsApi.subscribeToNewsletter as jest.Mock).mockResolvedValue(undefined);
    render(<NewsletterContent />);

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
    });
    expect(formsApi.subscribeToNewsletter).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(
      screen.getByRole("link", { name: "Read something now" })
    ).toHaveAttribute("href", "/blog");
  });

  it("merges a custom className", () => {
    render(<NewsletterContent className="mt-8" />);
    expect(screen.getByTestId("newsletter-content").className).toContain(
      "mt-8"
    );
  });

  it("contains no hype or frequency pressure (the expectations list may name what does not arrive)", () => {
    render(<NewsletterContent />);
    const text =
      screen.getByTestId("newsletter-content").textContent?.toLowerCase() ?? "";
    for (const word of ["free", "exclusive", "amazing", "hurry", "spam"]) {
      expect(text).not.toContain(word);
    }
  });
});
