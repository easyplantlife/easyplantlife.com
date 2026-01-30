/**
 * Event Tracking Utility for Google Analytics 4
 *
 * Provides functions to track meaningful user interactions as specified in MasterDocument.
 * Events are sent via gtag and include minimal necessary data to respect user privacy.
 *
 * Tracked events:
 * - Newsletter form view
 * - Newsletter submission (success/failure)
 * - Contact form submission
 * - Outbound clicks (Medium articles, book purchases)
 */

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      eventParams?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Generic event tracking function
 * Sends event to GA4 via gtag if available
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  // Guard against SSR and missing gtag
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * Track form view event
 * Fires when a form becomes visible to the user
 *
 * @param formName - Identifier for the form (e.g., "newsletter", "contact")
 */
export function trackFormView(formName: string): void {
  trackEvent("form_view", {
    form_name: formName,
  });
}

/**
 * Track newsletter form submission
 * Fires when user submits the newsletter form
 *
 * @param outcome - Result of the submission ("success" or "error")
 */
export function trackNewsletterSubmit(outcome: "success" | "error"): void {
  trackEvent("newsletter_submit", {
    outcome,
  });
}

/**
 * Track contact form submission
 * Fires when user submits the contact form
 *
 * @param outcome - Result of the submission ("success" or "error")
 */
export function trackContactSubmit(outcome: "success" | "error"): void {
  trackEvent("contact_submit", {
    outcome,
  });
}

/**
 * Track outbound link click
 * Fires when user clicks on an external link (Medium articles, book purchases)
 *
 * @param destination - The URL being navigated to
 * @param linkText - Optional text of the link clicked
 */
export function trackOutboundClick(
  destination: string,
  linkText?: string
): void {
  const params: Record<string, string> = {
    destination,
  };

  if (linkText) {
    params.link_text = linkText;
  }

  trackEvent("outbound_click", params);
}
