/**
 * Comprehensive Newsletter Component Tests
 *
 * Integration tests covering the newsletter form across every place it
 * appears: the reusable form, the newsletter page content, the home hero
 * and the full home page.
 *
 * GIVEN the newsletter form
 * WHEN submitted successfully
 * THEN success message displays
 *
 * GIVEN the home page newsletter form
 * WHEN submitted
 * THEN it functions identically to the dedicated page
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { NewsletterContent } from "@/components/newsletter";
import { Hero } from "@/components/home/Hero";
import Home from "@/app/page";
import { subscribeToNewsletter } from "@/lib/api/forms";

jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackNewsletterSubmit: jest.fn(),
  trackOutboundClick: jest.fn(),
}));

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn().mockResolvedValue([]),
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

const emailInput = () => screen.getByRole("textbox", { name: /email/i });
/** Hero uses "Get the notes"; the dedicated page uses "Subscribe". */
const submitButton = () =>
  screen.getByRole("button", { name: /subscribe|get the notes/i });

const okResponse = { ok: true, json: async () => ({ success: true }) };
const failResponse = {
  ok: false,
  json: async () => ({ error: "Server error" }),
};

describe("Comprehensive Newsletter Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("GIVEN the newsletter form WHEN submitted successfully THEN success message displays", () => {
    it("displays success message after NewsletterForm submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      const success = await screen.findByTestId("newsletter-success");
      expect(success).toHaveTextContent(/you're on the list/i);
      expect(success).toHaveTextContent("test@example.com");
    });

    it("displays success message after NewsletterContent submission", async () => {
      mockFetch.mockResolvedValueOnce(okResponse);
      const user = userEvent.setup();
      render(<NewsletterContent />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      expect(
        await screen.findByTestId("newsletter-success")
      ).toBeInTheDocument();
    });

    it("displays success message after Hero submission", async () => {
      mockFetch.mockResolvedValueOnce(okResponse);
      const user = userEvent.setup();
      render(<Hero />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      expect(
        await screen.findByTestId("newsletter-success")
      ).toBeInTheDocument();
    });

    it("hides form after successful submission", async () => {
      const user = userEvent.setup();
      render(
        <NewsletterForm onSubmit={jest.fn().mockResolvedValue(undefined)} />
      );

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      await waitFor(() => {
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void = () => {};
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterForm onSubmit={handleSubmit} />);

      await user.type(emailInput(), "test@example.com");
      await user.click(submitButton());

      const button = screen.getByRole("button", { name: /sending/i });
      expect(button).toBeDisabled();
      expect(emailInput()).toBeDisabled();

      resolveSubmit();
      await screen.findByTestId("newsletter-success");
    });
  });

  describe("GIVEN the home page newsletter form WHEN submitted THEN it functions identically to dedicated page", () => {
    const contexts = [
      { name: "home hero", ui: <Hero /> },
      { name: "dedicated page", ui: <NewsletterContent /> },
    ];

    describe("API call consistency", () => {
      it.each(contexts)(
        "$name form posts to /api/newsletter",
        async ({ ui }) => {
          mockFetch.mockResolvedValue(okResponse);
          const user = userEvent.setup();
          render(ui);

          await user.type(emailInput(), "same@example.com");
          await user.click(submitButton());

          await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: "same@example.com" }),
            });
          });
        }
      );
    });

    describe("Success state consistency", () => {
      it.each(contexts)("$name shows the same success note", async ({ ui }) => {
        mockFetch.mockResolvedValue(okResponse);
        const user = userEvent.setup();
        render(ui);

        await user.type(emailInput(), "test@example.com");
        await user.click(submitButton());

        const success = await screen.findByTestId("newsletter-success");
        expect(success).toHaveTextContent("You're on the list.");
        expect(success).toHaveAttribute("role", "status");
      });
    });

    describe("Error state consistency", () => {
      it.each(contexts)(
        "$name shows an alert when the API fails",
        async ({ ui }) => {
          mockFetch.mockResolvedValue(failResponse);
          const user = userEvent.setup();
          render(ui);

          await user.type(emailInput(), "test@example.com");
          await user.click(submitButton());

          expect(
            await screen.findByTestId("newsletter-error")
          ).toBeInTheDocument();
          expect(screen.getByRole("alert")).toBeInTheDocument();
          expect(screen.getByRole("form")).toBeInTheDocument();
        }
      );

      it("the hero form allows retry after error", async () => {
        mockFetch
          .mockResolvedValueOnce(failResponse)
          .mockResolvedValueOnce(okResponse);
        const user = userEvent.setup();
        render(<Hero />);

        await user.type(emailInput(), "test@example.com");
        await user.click(submitButton());
        await screen.findByTestId("newsletter-error");

        await user.click(submitButton());
        expect(
          await screen.findByTestId("newsletter-success")
        ).toBeInTheDocument();
      });
    });

    describe("Validation consistency", () => {
      it.each(contexts)(
        "$name validates email format before submission",
        async ({ ui }) => {
          const user = userEvent.setup();
          render(ui);

          await user.type(emailInput(), "invalid");
          await user.click(submitButton());

          expect(emailInput()).toBeInvalid();
          expect(screen.getByRole("alert")).toBeInTheDocument();
          expect(mockFetch).not.toHaveBeenCalled();
        }
      );
    });

    describe("Loading state consistency", () => {
      it.each(contexts)("$name shows a sending state", async ({ ui }) => {
        let resolveFetch: () => void = () => {};
        mockFetch.mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              resolveFetch = () => resolve(okResponse);
            })
        );
        const user = userEvent.setup();
        render(ui);

        await user.type(emailInput(), "test@example.com");
        await user.click(submitButton());

        const button = screen.getByRole("button", { name: /sending/i });
        expect(button).toBeDisabled();

        resolveFetch();
        await screen.findByTestId("newsletter-success");
      });
    });

    describe("Accessibility consistency", () => {
      it.each(contexts)(
        "$name form and field have accessible names",
        ({ ui }) => {
          render(ui);
          expect(
            screen.getByRole("form", { name: /newsletter signup/i })
          ).toHaveAccessibleName();
          expect(emailInput()).toHaveAccessibleName();
        }
      );

      it.each(contexts)("$name uses role=alert for errors", async ({ ui }) => {
        mockFetch.mockResolvedValue(failResponse);
        const user = userEvent.setup();
        render(ui);

        await user.type(emailInput(), "test@example.com");
        await user.click(submitButton());

        expect(await screen.findByRole("alert")).toBeInTheDocument();
      });
    });
  });

  describe("Full page integration", () => {
    it("home page newsletter form integrates correctly", async () => {
      mockFetch.mockResolvedValue(okResponse);
      const user = userEvent.setup();
      render(await Home());

      const hero = screen.getByTestId("hero-section");
      const input = within(hero).getByRole("textbox", { name: /email/i });
      const button = within(hero).getByRole("button", {
        name: /get the notes/i,
      });

      await user.type(input, "home@example.com");
      await user.click(button);

      expect(
        await screen.findByTestId("newsletter-success")
      ).toBeInTheDocument();
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.any(Object)
      );
    });

    it("the home page has exactly one newsletter form", async () => {
      render(await Home());
      expect(
        screen.getAllByRole("form", { name: /newsletter signup/i })
      ).toHaveLength(1);
    });
  });

  describe("subscribeToNewsletter", () => {
    it("calls the newsletter API with correct payload", async () => {
      mockFetch.mockResolvedValueOnce(okResponse);

      await subscribeToNewsletter("api-test@example.com");

      expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "api-test@example.com" }),
      });
    });

    it("throws the server message when the API returns non-ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid email" }),
      });

      await expect(subscribeToNewsletter("test@example.com")).rejects.toThrow(
        "Invalid email"
      );
    });

    it("throws a generic error when the API error has no message", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });

      await expect(subscribeToNewsletter("test@example.com")).rejects.toThrow(
        "Failed to subscribe"
      );
    });

    it("throws a generic error when the error body is not JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => {
          throw new Error("bad json");
        },
      });

      await expect(subscribeToNewsletter("test@example.com")).rejects.toThrow(
        "Failed to subscribe"
      );
    });
  });
});

describe("Brand Compliance Across Newsletter Components", () => {
  const hypeWords = [
    "free",
    "exclusive",
    "amazing",
    "incredible",
    "best",
    "revolutionary",
    "guaranteed",
    "limited",
    "urgent",
    "act now",
    "don't miss",
    "now!",
    "hurry",
  ];

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue(okResponse);
  });

  it("Hero contains no hype language", () => {
    render(<Hero />);
    const text =
      screen.getByTestId("hero-section").textContent?.toLowerCase() ?? "";
    for (const word of hypeWords) {
      expect(text).not.toContain(word);
    }
  });

  it("NewsletterContent contains no hype language", () => {
    render(<NewsletterContent />);
    const text =
      screen.getByTestId("newsletter-content").textContent?.toLowerCase() ?? "";
    for (const word of hypeWords) {
      expect(text).not.toContain(word);
    }
  });

  it("success messages contain no hype language", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.type(emailInput(), "test@example.com");
    await user.click(submitButton());

    const success = await screen.findByTestId("newsletter-success");
    const text = success.textContent?.toLowerCase() ?? "";
    for (const word of hypeWords) {
      expect(text).not.toContain(word);
    }
  });

  it("no frequency pressure language in the hero form copy", () => {
    render(<Hero />);
    const form = screen.getByRole("form", { name: /newsletter signup/i });
    const text = form.textContent?.toLowerCase() ?? "";
    for (const word of [
      "daily",
      "weekly",
      "constantly",
      "frequently",
      "spam",
    ]) {
      expect(text).not.toContain(word);
    }
  });
});
