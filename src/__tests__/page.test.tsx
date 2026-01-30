import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Easy Plant Life");
  });

  it("renders the tagline", () => {
    render(<Home />);

    const tagline = screen.getByText("A calm approach to living with plants");

    expect(tagline).toBeInTheDocument();
  });

  it("renders the Tailwind test element", () => {
    render(<Home />);

    const testElement = screen.getByTestId("tailwind-test");

    expect(testElement).toBeInTheDocument();
    expect(testElement).toHaveTextContent("Tailwind CSS is working correctly");
  });
});
