import { TextDecoder, TextEncoder } from "util";
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

// postal-mime (pulled in by resend >= 6.9.2) uses TextEncoder at module load.
// jsdom does not provide these globals.
if (typeof globalThis.TextEncoder === "undefined") {
  globalThis.TextEncoder = TextEncoder;
}
if (typeof globalThis.TextDecoder === "undefined") {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;
}

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Suppress specific console.error messages that are expected during tests
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const message = args[0];
  if (typeof message === "string") {
    // Suppress expected HTML nesting warning when testing RootLayout
    if (message.includes("<html> cannot be a child of <div>")) {
      return;
    }
    // Suppress expected priority attribute warning from next/image mock
    if (
      message.includes("non-boolean attribute") &&
      message.includes("priority")
    ) {
      return;
    }
    // Suppress expected error logs from API route error handling tests
    if (
      message.includes("Contact form error:") ||
      message.includes("Newsletter signup error:")
    ) {
      return;
    }
    // Suppress expected React act() warnings during async form tests
    if (message.includes("not wrapped in act(")) {
      return;
    }
  }
  originalConsoleError(...args);
};
