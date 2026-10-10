import { render, screen } from "@testing-library/react";
import { Panel } from "@/components/ui/Panel";

describe("Panel", () => {
  it("renders children on a surface box", () => {
    render(<Panel data-testid="panel">Hello</Panel>);
    const panel = screen.getByTestId("panel");
    expect(panel).toHaveTextContent("Hello");
    expect(panel.className).toContain("bg-surface");
    expect(panel.className).toContain("border-line");
  });

  it("can render as a section or aside", () => {
    render(
      <Panel as="aside" aria-label="Where to start">
        Hello
      </Panel>
    );
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("lays out intrinsic columns when asked", () => {
    render(
      <Panel columns data-testid="panel">
        <div>a</div>
        <div>b</div>
      </Panel>
    );
    expect(screen.getByTestId("panel").className).toContain("grid");
  });
});
