import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactContent } from "@/components/contact";

/**
 * Contact API Integration Tests
 *
 * Tests the handleContactSubmit function through the ContactContent component.
 * This file does NOT mock ContactForm to test the full integration.
 */

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Contact API Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("shows error message when API fails with error field", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Custom error message" }),
    });

    const user = userEvent.setup();
    render(<ContactContent />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const messageInput = screen.getByRole("textbox", { name: /message/i });
    const button = screen.getByRole("button", { name: /send|submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Hello!");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("contact-error")).toBeInTheDocument();
    });
  });

  it("shows default error message when API fails without error field", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false }), // No 'error' field
    });

    const user = userEvent.setup();
    render(<ContactContent />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const messageInput = screen.getByRole("textbox", { name: /message/i });
    const button = screen.getByRole("button", { name: /send|submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Hello!");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("contact-error")).toBeInTheDocument();
    });
  });

  it("shows success message when API succeeds", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<ContactContent />);

    const nameInput = screen.getByRole("textbox", { name: /name/i });
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const messageInput = screen.getByRole("textbox", { name: /message/i });
    const button = screen.getByRole("button", { name: /send|submit/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Hello!");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("contact-success")).toBeInTheDocument();
    });
  });
});
