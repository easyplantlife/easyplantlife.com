import { render, screen } from "@testing-library/react";
import { SectionHeader } from "@/components/ui/SectionHeader";

describe("SectionHeader", () => {
  it("renders an eyebrow and an h2 by default", () => {
    render(<SectionHeader eyebrow="From the blog" title="Recent writing" />);
    expect(screen.getByText("From the blog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Recent writing" })
    ).toBeInTheDocument();
  });

  it("supports other heading levels", () => {
    render(<SectionHeader title="Books" level={3} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Books" })
    ).toBeInTheDocument();
  });

  it("renders an optional action", () => {
    render(
      <SectionHeader title="Recent writing" action={<a href="/books">All</a>} />
    );
    expect(screen.getByRole("link", { name: "All" })).toBeInTheDocument();
  });
});
