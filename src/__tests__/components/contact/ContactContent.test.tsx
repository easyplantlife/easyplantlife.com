import { render, screen } from "@testing-library/react";
import { ContactContent } from "@/components/contact";

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackContactSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

jest.mock("@/lib/api/forms", () => ({
  sendContactMessage: jest.fn(),
}));

describe("ContactContent", () => {
  it("renders an article with the content test id", () => {
    render(<ContactContent />);
    expect(screen.getByTestId("contact-content").tagName).toBe("ARTICLE");
  });

  it("renders the page heading and a calm invitation", () => {
    render(<ContactContent />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Say hello." })
    ).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText(/a short note is fine/i)).toBeInTheDocument();
  });

  it("offers the plain email address as a mailto link", () => {
    render(<ContactContent />);
    const link = screen.getByRole("link", { name: "hello@easyplantlife.com" });
    expect(link).toHaveAttribute("href", "mailto:hello@easyplantlife.com");
  });

  it("renders the contact form", () => {
    render(<ContactContent />);
    expect(screen.getByRole("form", { name: /contact/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^name$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /message/i })
    ).toBeInTheDocument();
  });

  it("promises a human reply and no hidden signup", () => {
    render(<ContactContent />);
    expect(
      screen.getByText(/messages are read by a person/i)
    ).toBeInTheDocument();
  });

  it("has no social links", () => {
    render(<ContactContent />);
    const hrefs = screen
      .getAllByRole("link")
      .map((l) => l.getAttribute("href") ?? "");
    expect(
      hrefs.some((h) => /twitter|instagram|facebook|x\.com|linkedin/i.test(h))
    ).toBe(false);
  });

  it("merges a custom className", () => {
    render(<ContactContent className="mt-8" />);
    expect(screen.getByTestId("contact-content").className).toContain("mt-8");
  });
});
