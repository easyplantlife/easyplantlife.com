import { sendContactMessage, subscribeToNewsletter } from "@/lib/api/forms";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("subscribeToNewsletter", () => {
  beforeEach(() => mockFetch.mockReset());

  it("posts the email as JSON to the newsletter route", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await expect(subscribeToNewsletter("a@b.co")).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/newsletter",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "a@b.co" }),
      })
    );
  });

  it("rejects with the server's message", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Already subscribed" }),
    });
    await expect(subscribeToNewsletter("a@b.co")).rejects.toThrow(
      "Already subscribed"
    );
  });

  it("falls back to a generic message when the body has no error", async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({}) });
    await expect(subscribeToNewsletter("a@b.co")).rejects.toThrow(
      "Failed to subscribe"
    );
  });

  it("falls back when the body is not JSON", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => {
        throw new Error("not json");
      },
    });
    await expect(subscribeToNewsletter("a@b.co")).rejects.toThrow(
      "Failed to subscribe"
    );
  });
});

describe("sendContactMessage", () => {
  beforeEach(() => mockFetch.mockReset());

  const message = { name: "Jo", email: "jo@b.co", message: "Hi" };

  it("posts the message as JSON to the contact route", async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await expect(sendContactMessage(message)).resolves.toBeUndefined();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(message),
      })
    );
  });

  it("rejects with the server's message or a fallback", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Rate limited" }),
    });
    await expect(sendContactMessage(message)).rejects.toThrow("Rate limited");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => {
        throw new Error("not json");
      },
    });
    await expect(sendContactMessage(message)).rejects.toThrow(
      "Failed to send message"
    );
  });
});
