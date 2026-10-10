/**
 * Browser-side callers for the site's form API routes.
 *
 * Both reject with an Error carrying the server's message (or a generic one)
 * so forms can show it without knowing about fetch.
 */

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

async function postJson(url: string, body: unknown, fallback: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      typeof data?.error === "string" && data.error ? data.error : fallback
    );
  }
}

export async function subscribeToNewsletter(email: string): Promise<void> {
  await postJson("/api/newsletter", { email }, "Failed to subscribe");
}

export async function sendContactMessage(data: ContactMessage): Promise<void> {
  await postJson("/api/contact", data, "Failed to send message");
}
