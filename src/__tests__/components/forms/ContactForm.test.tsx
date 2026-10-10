import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";
import * as analytics from "@/lib/analytics/events";
import * as formsApi from "@/lib/api/forms";

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

jest.mock("@/lib/api/forms", () => ({
  sendContactMessage: jest.fn(),
}));

const nameInput = () => screen.getByRole("textbox", { name: /^name$/i });
const emailInput = () => screen.getByRole("textbox", { name: /^email$/i });
const messageInput = () => screen.getByRole("textbox", { name: /message/i });
const submitButton = () =>
  screen.getByRole("button", { name: /send message/i });

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(nameInput(), "Maya");
  await user.type(emailInput(), "maya@example.com");
  await user.type(messageInput(), "Hello there");
}

describe("ContactForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders a labelled form with name, email and message fields", () => {
      render(<ContactForm />);
      expect(
        screen.getByRole("form", { name: /contact/i })
      ).toBeInTheDocument();
      expect(nameInput()).toHaveAttribute("type", "text");
      expect(emailInput()).toHaveAttribute("type", "email");
      expect(messageInput().tagName).toBe("TEXTAREA");
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("uses a single-line input for name and email, not a textarea", () => {
      render(<ContactForm />);
      expect(nameInput().tagName).toBe("INPUT");
      expect(emailInput().tagName).toBe("INPUT");
    });

    it("explains what the email is used for", () => {
      render(<ContactForm />);
      const hint = screen.getByText("Only used to reply to you.");
      expect(emailInput()).toHaveAttribute("aria-describedby", hint.id);
    });

    it("renders the submit button and the reply address", () => {
      render(<ContactForm />);
      expect(submitButton()).toHaveAttribute("type", "submit");
      expect(
        screen.getByText(/replies come from hello@easyplantlife\.com/i)
      ).toBeInTheDocument();
    });

    it("renders a hidden honeypot field", () => {
      render(<ContactForm />);
      const honeypot = screen.getByTestId("contact-honeypot");
      expect(honeypot).toHaveAttribute("tabindex", "-1");
      expect(honeypot).toHaveAttribute("autocomplete", "off");
      expect(honeypot.closest("[aria-hidden='true']")).not.toBeNull();
    });

    it("tracks a form view on mount", () => {
      render(<ContactForm />);
      expect(analytics.trackFormView).toHaveBeenCalledWith("contact");
    });
  });

  describe("Validation", () => {
    it("requires a name", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<ContactForm onSubmit={onSubmit} />);

      await user.click(submitButton());

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter your name."
      );
      expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("requires an email", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={jest.fn()} />);

      await user.type(nameInput(), "Maya");
      await user.click(submitButton());

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter your email address."
      );
    });

    it("requires a valid email", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={jest.fn()} />);

      await user.type(nameInput(), "Maya");
      await user.type(emailInput(), "nope");
      await user.click(submitButton());

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter a valid email address."
      );
    });

    it("requires a message", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={jest.fn()} />);

      await user.type(nameInput(), "Maya");
      await user.type(emailInput(), "maya@example.com");
      await user.click(submitButton());

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Please enter your message."
      );
    });

    it("links the error to the form and clears it on typing", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={jest.fn()} />);

      await user.click(submitButton());
      const error = screen.getByRole("alert");
      expect(screen.getByRole("form")).toHaveAttribute(
        "aria-describedby",
        error.id
      );

      await user.type(nameInput(), "M");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Submission", () => {
    it("submits trimmed values and shows the success note", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={onSubmit} />);

      await user.type(nameInput(), "  Maya ");
      await user.type(emailInput(), " maya@example.com ");
      await user.type(messageInput(), " Hello there ");
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Maya",
        email: "maya@example.com",
        message: "Hello there",
      });
      const success = screen.getByRole("status");
      expect(success).toHaveTextContent("Message sent.");
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
      expect(analytics.trackContactSubmit).toHaveBeenCalledWith("success");
    });

    it("defaults to sending through the contact API", async () => {
      const user = userEvent.setup();
      (formsApi.sendContactMessage as jest.Mock).mockResolvedValue(undefined);
      render(<ContactForm />);

      await fillValidForm(user);
      await user.click(submitButton());

      await waitFor(() => {
        expect(formsApi.sendContactMessage).toHaveBeenCalledWith({
          name: "Maya",
          email: "maya@example.com",
          message: "Hello there",
        });
      });
    });

    it("shows a busy, disabled state while sending", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void = () => {};
      const onSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<ContactForm onSubmit={onSubmit} />);

      await fillValidForm(user);
      await user.click(submitButton());

      const button = screen.getByRole("button", { name: /sending/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(nameInput()).toBeDisabled();
      expect(emailInput()).toBeDisabled();
      expect(messageInput()).toBeDisabled();

      resolveSubmit();
      await screen.findByTestId("contact-success");
    });

    it("shows an error and keeps the values when sending fails", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockRejectedValue(new Error("boom"));
      render(<ContactForm onSubmit={onSubmit} />);

      await fillValidForm(user);
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          "Something went wrong. Please try again."
        );
      });
      expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      expect(messageInput()).toHaveValue("Hello there");
      expect(analytics.trackContactSubmit).toHaveBeenCalledWith("error");
    });

    it("offers a way back and a way to send another from the success note", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={jest.fn().mockResolvedValue(undefined)} />);

      await fillValidForm(user);
      await user.click(submitButton());
      await screen.findByTestId("contact-success");

      expect(
        screen.getByRole("link", { name: /back to the home page/i })
      ).toHaveAttribute("href", "/");

      await user.click(screen.getByRole("button", { name: /send another/i }));

      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(nameInput()).toHaveValue("");
      expect(messageInput()).toHaveValue("");
    });
  });

  describe("Honeypot", () => {
    it("silently succeeds without sending or tracking when the honeypot is filled", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<ContactForm onSubmit={onSubmit} />);

      await user.type(screen.getByTestId("contact-honeypot"), "spam");
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(analytics.trackContactSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Keyboard", () => {
    it("moves focus through the fields in order, skipping the honeypot", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.tab();
      expect(nameInput()).toHaveFocus();
      await user.tab();
      expect(emailInput()).toHaveFocus();
      await user.tab();
      expect(messageInput()).toHaveFocus();
      await user.tab();
      expect(submitButton()).toHaveFocus();
    });
  });
});
