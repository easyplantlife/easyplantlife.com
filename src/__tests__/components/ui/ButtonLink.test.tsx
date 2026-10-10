import { render, screen } from "@testing-library/react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { buttonClassName } from "@/components/ui/Button";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

describe("ButtonLink", () => {
  it("renders an anchor with the same classes as Button", () => {
    render(<ButtonLink href="/newsletter">Newsletter</ButtonLink>);
    const link = screen.getByRole("link", { name: "Newsletter" });
    expect(link).toHaveAttribute("href", "/newsletter");
    for (const cls of buttonClassName().split(" ")) {
      expect(link.className).toContain(cls);
    }
  });

  it("supports secondary variant and small size", () => {
    render(
      <ButtonLink href="/newsletter" variant="secondary" size="sm">
        Newsletter
      </ButtonLink>
    );
    const link = screen.getByRole("link");
    expect(link.className).toContain("border-tint-line");
    expect(link.className).toContain("h-10");
  });

  it("opens external links in a new tab", () => {
    render(
      <ButtonLink href="https://www.amazon.com/dp/B0GL118S83">
        Buy on Amazon
      </ButtonLink>
    );
    const link = screen.getByRole("link", { name: "Buy on Amazon" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
