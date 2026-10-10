import { render, screen, within } from "@testing-library/react";
import { PreferEmail } from "@/components/blog/PreferEmail";

describe("PreferEmail", () => {
  it("renders an aside labelled by its question", () => {
    render(<PreferEmail />);
    const aside = screen.getByRole("complementary", { name: "Prefer email?" });
    expect(aside).toBeInTheDocument();
    expect(
      within(aside).getByText(/one short note when there is something/i)
    ).toBeInTheDocument();
  });

  it("links to the newsletter", () => {
    render(<PreferEmail />);
    expect(screen.getByRole("link", { name: "Get the notes" })).toHaveAttribute(
      "href",
      "/newsletter"
    );
  });

  it("forwards extra props", () => {
    render(<PreferEmail data-testid="prefer-email" className="mt-2" />);
    expect(screen.getByTestId("prefer-email").className).toContain("mt-2");
  });
});
