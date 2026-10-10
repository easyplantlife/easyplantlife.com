import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/ui/Textarea";

describe("Textarea", () => {
  it("renders a textarea associated with its label", () => {
    render(<Textarea label="Message" />);
    const field = screen.getByLabelText("Message");
    expect(field.tagName).toBe("TEXTAREA");
  });

  it("defaults to six rows and allows vertical resizing", () => {
    render(<Textarea label="Message" />);
    const field = screen.getByLabelText("Message");
    expect(field).toHaveAttribute("rows", "6");
    expect(field.className).toContain("resize-y");
  });

  it("does not set a fixed height like the single-line input", () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText("Message").className).not.toContain("h-12");
  });

  it("can hide its label visually while keeping it accessible", () => {
    render(<Textarea label="Message" hideLabel />);
    expect(screen.getByText("Message").className).toContain("sr-only");
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("shows a hint and links it via aria-describedby", () => {
    render(<Textarea label="Message" hint="A short note is fine." />);
    const field = screen.getByLabelText("Message");
    const hint = screen.getByText("A short note is fine.");
    expect(field).toHaveAttribute("aria-describedby", hint.id);
  });

  it("shows an error, marks the field invalid and replaces the hint", () => {
    render(
      <Textarea label="Message" hint="Hint" error="Please enter a message." />
    );
    const field = screen.getByLabelText("Message");
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Please enter a message.");
    expect(field).toHaveAttribute("aria-invalid", "true");
    expect(field).toHaveAttribute("aria-describedby", error.id);
    expect(screen.queryByText("Hint")).not.toBeInTheDocument();
  });

  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Message" />);
    const field = screen.getByLabelText("Message");
    await user.type(field, "Hello");
    expect(field).toHaveValue("Hello");
  });

  it("respects disabled", () => {
    render(<Textarea label="Message" disabled />);
    expect(screen.getByLabelText("Message")).toBeDisabled();
  });
});
