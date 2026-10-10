import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NewsletterForm,
  NEWSLETTER_INVALID_EMAIL,
  NEWSLETTER_SUBMIT_FAILED,
} from "@/components/forms/NewsletterForm";
import * as analytics from "@/lib/analytics/events";
import * as formsApi from "@/lib/api/forms";

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
}));

jest.mock("@/lib/api/forms", () => ({
  subscribeToNewsletter: jest.fn(),
}));

const emailInput = () => screen.getByRole("textbox", { name: /email/i });
const submitButton = (name: RegExp = /subscribe/i) =>
  screen.getByRole("button", { name });

describe("NewsletterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders a labelled form with an email field and submit button", () => {
      render(<NewsletterForm />);
      expect(
        screen.getByRole("form", { name: /newsletter signup/i })
      ).toBeInTheDocument();
      expect(emailInput()).toHaveAttribute("type", "email");
      expect(submitButton()).toHaveAttribute("type", "submit");
      expect(screen.getByTestId("newsletter-form")).toBeInTheDocument();
    });

    it("shows the label in the stacked layout", () => {
      render(<NewsletterForm layout="stacked" />);
      expect(screen.getByText("Email address").className).not.toContain(
        "sr-only"
      );
    });

    it("hides the label visually in the inline layout but keeps it accessible", () => {
      render(<NewsletterForm layout="inline" />);
      expect(screen.getByText("Email address").className).toContain("sr-only");
      expect(emailInput()).toHaveAccessibleName(/email/i);
    });

    it("supports a custom submit label and help text", () => {
      render(
        <NewsletterForm submitLabel="Get the notes" helpText="No schedule." />
      );
      expect(submitButton(/get the notes/i)).toBeInTheDocument();
      expect(screen.getByText("No schedule.")).toBeInTheDocument();
    });

    it("links the help text to the field by default", () => {
      render(<NewsletterForm helpText="No schedule." />);
      const help = screen.getByText("No schedule.");
      expect(emailInput()).toHaveAttribute("aria-describedby", help.id);
    });

    it("disables native validation so copy comes from the component", () => {
      render(<NewsletterForm />);
      expect(screen.getByRole("form")).toHaveAttribute("novalidate");
    });

    it("tracks a form view on mount", () => {
      render(<NewsletterForm />);
      expect(analytics.trackFormView).toHaveBeenCalledWith("newsletter");
    });
  });

  describe("Validation", () => {
    it("shows an error for an empty submission", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.click(submitButton());

      const error = screen.getByRole("alert");
      expect(error).toHaveTextContent(NEWSLETTER_INVALID_EMAIL);
      expect(screen.getByTestId("newsletter-error")).toBe(error);
      expect(emailInput()).toHaveAttribute("aria-invalid", "true");
      expect(emailInput()).toHaveAttribute("aria-describedby", error.id);
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("shows an error for an invalid email", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={jest.fn()} />);

      await user.type(emailInput(), "not-an-email");
      await user.click(submitButton());

      expect(screen.getByRole("alert")).toHaveTextContent(
        NEWSLETTER_INVALID_EMAIL
      );
    });

    it("clears the error once the user types again", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm onSubmit={jest.fn()} />);

      await user.click(submitButton());
      expect(screen.getByRole("alert")).toBeInTheDocument();

      await user.type(emailInput(), "a");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(emailInput()).not.toHaveAttribute("aria-invalid");
    });
  });

  describe("Submission", () => {
    it("calls onSubmit with the email and shows the success note", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
      expect(onSubmit).toHaveBeenCalledWith("test@example.com");

      const success = screen.getByRole("status");
      expect(success).toHaveTextContent("You're on the list.");
      expect(success).toHaveTextContent("test@example.com");
      expect(screen.queryByRole("form")).not.toBeInTheDocument();
      expect(screen.getByTestId("newsletter-form")).toBeInTheDocument();
      expect(analytics.trackNewsletterSubmit).toHaveBeenCalledWith("success");
    });

    it("defaults to subscribing through the newsletter API", async () => {
      const user = userEvent.setup();
      (formsApi.subscribeToNewsletter as jest.Mock).mockResolvedValue(
        undefined
      );
      render(<NewsletterForm />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      await waitFor(() => {
        expect(formsApi.subscribeToNewsletter).toHaveBeenCalledWith(
          "test@example.com"
        );
      });
      expect(
        await screen.findByTestId("newsletter-success")
      ).toBeInTheDocument();
    });

    it("shows a busy, disabled button while sending", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void = () => {};
      const onSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      const button = screen.getByRole("button", { name: /sending/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
      expect(emailInput()).toBeDisabled();

      resolveSubmit();
      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("shows an error and keeps the form when submission fails", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockRejectedValue(new Error("boom"));
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.getByRole("alert")).toHaveTextContent(
          NEWSLETTER_SUBMIT_FAILED
        );
      });
      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(emailInput()).toHaveValue("test@example.com");
      expect(analytics.trackNewsletterSubmit).toHaveBeenCalledWith("error");
    });

    it("allows resubmitting after a failure", async () => {
      const user = userEvent.setup();
      const onSubmit = jest
        .fn()
        .mockRejectedValueOnce(new Error("boom"))
        .mockResolvedValueOnce(undefined);
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());
      await screen.findByRole("alert");

      await user.click(submitButton());
      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
      expect(onSubmit).toHaveBeenCalledTimes(2);
    });

    it("can be submitted with the keyboard", async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={onSubmit} />);

      await user.type(emailInput(), "test@example.com{Enter}");

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith("test@example.com");
      });
    });
  });

  describe("Success note", () => {
    async function submitSuccessfully(ui: React.ReactElement) {
      const user = userEvent.setup();
      render(ui);
      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());
      await screen.findByTestId("newsletter-success");
      return user;
    }

    it("renders extra success actions", async () => {
      await submitSuccessfully(
        <NewsletterForm
          onSubmit={jest.fn().mockResolvedValue(undefined)}
          successActions={<a href="/blog">Read something now</a>}
        />
      );
      expect(
        screen.getByRole("link", { name: "Read something now" })
      ).toBeInTheDocument();
    });

    it("resets to an empty form from the success note", async () => {
      const user = await submitSuccessfully(
        <NewsletterForm onSubmit={jest.fn().mockResolvedValue(undefined)} />
      );

      await user.click(
        screen.getByRole("button", { name: /use a different address/i })
      );

      expect(screen.getByRole("form")).toBeInTheDocument();
      expect(emailInput()).toHaveValue("");
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  describe("Brand tone", () => {
    it("contains no hype or frequency pressure", () => {
      render(<NewsletterForm />);
      const text = screen.getByRole("form").textContent?.toLowerCase() ?? "";
      for (const word of ["free", "exclusive", "amazing", "daily", "weekly"]) {
        expect(text).not.toContain(word);
      }
    });
  });
});
