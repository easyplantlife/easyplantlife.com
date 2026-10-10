import { render, screen } from "@testing-library/react";
import { StatusNote } from "@/components/ui/StatusNote";

describe("StatusNote", () => {
  it("renders as a polite live region", () => {
    render(<StatusNote title="You're on the list." />);
    const note = screen.getByRole("status");
    expect(note).toHaveAttribute("aria-live", "polite");
    expect(note).toHaveTextContent("You're on the list.");
  });

  it("renders body text and actions", () => {
    render(
      <StatusNote
        title="Message sent."
        actions={<a href="#top">Back to the home page</a>}
      >
        Thanks for writing.
      </StatusNote>
    );
    expect(screen.getByText("Thanks for writing.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to the home page" })
    ).toBeInTheDocument();
  });

  it("hides the check icon from assistive tech", () => {
    render(<StatusNote title="Done" />);
    const svg = screen.getByRole("status").querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("uses a serif title in the large size", () => {
    render(<StatusNote title="Done" size="lg" />);
    expect(screen.getByText("Done").className).toContain("font-serif");
  });
});
