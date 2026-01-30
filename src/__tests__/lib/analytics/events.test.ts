/**
 * Event Tracking Utility Tests
 *
 * Tests for M10-02: Add Custom Event Tracking
 *
 * Acceptance Criteria:
 * - Event tracking utility created
 * - Newsletter form view event fires
 * - Newsletter submit event fires with outcome
 * - Contact submit event fires
 * - Outbound link clicks tracked
 * - Events include minimal necessary data
 *
 * Test Cases:
 * GIVEN the newsletter form
 * WHEN it becomes visible
 * THEN a form_view event is sent to GA4
 *
 * GIVEN a Medium link
 * WHEN clicked
 * THEN an outbound_click event is sent with destination
 */

import {
  trackEvent,
  trackFormView,
  trackNewsletterSubmit,
  trackContactSubmit,
  trackOutboundClick,
} from "@/lib/analytics/events";

// Mock window.gtag
const mockGtag = jest.fn();

describe("Event Tracking Utility (M10-02)", () => {
  const originalGtag = window.gtag;

  beforeEach(() => {
    jest.clearAllMocks();
    // Assign mock gtag to window
    window.gtag = mockGtag;
  });

  afterEach(() => {
    // Restore original gtag
    window.gtag = originalGtag;
  });

  describe("trackEvent", () => {
    it("sends event to GA4 via gtag when available", () => {
      trackEvent("test_event", { category: "test" });

      expect(mockGtag).toHaveBeenCalledWith("event", "test_event", {
        category: "test",
      });
    });

    it("handles missing gtag gracefully without throwing", () => {
      window.gtag = undefined;

      expect(() => trackEvent("test_event")).not.toThrow();
    });

    it("sends events with minimal data only", () => {
      trackEvent("minimal_event", { key: "value" });

      const call = mockGtag.mock.calls[0];
      expect(call[0]).toBe("event");
      expect(call[1]).toBe("minimal_event");
      expect(call[2]).toEqual({ key: "value" });
    });
  });

  describe("trackFormView", () => {
    it("sends form_view event with form name", () => {
      trackFormView("newsletter");

      expect(mockGtag).toHaveBeenCalledWith("event", "form_view", {
        form_name: "newsletter",
      });
    });

    it("tracks contact form view", () => {
      trackFormView("contact");

      expect(mockGtag).toHaveBeenCalledWith("event", "form_view", {
        form_name: "contact",
      });
    });
  });

  describe("trackNewsletterSubmit", () => {
    it("sends newsletter_submit event with success outcome", () => {
      trackNewsletterSubmit("success");

      expect(mockGtag).toHaveBeenCalledWith("event", "newsletter_submit", {
        outcome: "success",
      });
    });

    it("sends newsletter_submit event with error outcome", () => {
      trackNewsletterSubmit("error");

      expect(mockGtag).toHaveBeenCalledWith("event", "newsletter_submit", {
        outcome: "error",
      });
    });

    it("does not include email or PII in the event", () => {
      trackNewsletterSubmit("success");

      const eventParams = mockGtag.mock.calls[0][2];
      expect(eventParams).not.toHaveProperty("email");
      expect(eventParams).not.toHaveProperty("user_id");
      expect(Object.keys(eventParams)).toEqual(["outcome"]);
    });
  });

  describe("trackContactSubmit", () => {
    it("sends contact_submit event with success outcome", () => {
      trackContactSubmit("success");

      expect(mockGtag).toHaveBeenCalledWith("event", "contact_submit", {
        outcome: "success",
      });
    });

    it("sends contact_submit event with error outcome", () => {
      trackContactSubmit("error");

      expect(mockGtag).toHaveBeenCalledWith("event", "contact_submit", {
        outcome: "error",
      });
    });

    it("does not include message content or PII in the event", () => {
      trackContactSubmit("success");

      const eventParams = mockGtag.mock.calls[0][2];
      expect(eventParams).not.toHaveProperty("email");
      expect(eventParams).not.toHaveProperty("name");
      expect(eventParams).not.toHaveProperty("message");
      expect(Object.keys(eventParams)).toEqual(["outcome"]);
    });
  });

  describe("trackOutboundClick", () => {
    it("sends outbound_click event with destination URL", () => {
      trackOutboundClick("https://medium.com/@easyplantlife/article");

      expect(mockGtag).toHaveBeenCalledWith("event", "outbound_click", {
        destination: "https://medium.com/@easyplantlife/article",
      });
    });

    it("tracks book purchase links", () => {
      trackOutboundClick("https://amazon.com/dp/123456");

      expect(mockGtag).toHaveBeenCalledWith("event", "outbound_click", {
        destination: "https://amazon.com/dp/123456",
      });
    });

    it("includes link text when provided", () => {
      trackOutboundClick("https://medium.com/article", "Read on Medium");

      expect(mockGtag).toHaveBeenCalledWith("event", "outbound_click", {
        destination: "https://medium.com/article",
        link_text: "Read on Medium",
      });
    });

    it("does not include link_text when not provided", () => {
      trackOutboundClick("https://example.com");

      const eventParams = mockGtag.mock.calls[0][2];
      expect(eventParams).not.toHaveProperty("link_text");
      expect(Object.keys(eventParams)).toEqual(["destination"]);
    });
  });
});
