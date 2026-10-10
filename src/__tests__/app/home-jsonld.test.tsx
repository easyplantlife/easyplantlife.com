/**
 * Home Page JSON-LD Integration Tests
 *
 * Tests that the home page includes proper JSON-LD structured data
 * for Organization and WebSite schemas.
 */

import { render } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/lib/api/medium", () => ({
  fetchMediumPosts: jest.fn().mockResolvedValue([]),
}));

type JsonLd = {
  "@context"?: string;
  "@type"?: string;
  name?: string;
  url?: string;
};

function getAllJsonLdData(container: HTMLElement): JsonLd[] {
  const scripts = container.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  return Array.from(scripts).map((script) =>
    JSON.parse(script.textContent || "{}")
  );
}

async function renderHomeJsonLd() {
  const { container } = render(await Home());
  return getAllJsonLdData(container);
}

describe("Home Page JSON-LD", () => {
  it("includes Organization JSON-LD", async () => {
    const data = await renderHomeJsonLd();
    expect(data.find((d) => d["@type"] === "Organization")).toBeDefined();
  });

  it("includes WebSite JSON-LD", async () => {
    const data = await renderHomeJsonLd();
    expect(data.find((d) => d["@type"] === "WebSite")).toBeDefined();
  });

  it("Organization schema has correct structure", async () => {
    const data = await renderHomeJsonLd();
    const org = data.find((d) => d["@type"] === "Organization");
    expect(org?.["@context"]).toBe("https://schema.org");
    expect(org?.name).toBe("Easy Plant Life");
    expect(org?.url).toBe("https://easyplantlife.com");
  });

  it("WebSite schema has correct structure", async () => {
    const data = await renderHomeJsonLd();
    const site = data.find((d) => d["@type"] === "WebSite");
    expect(site?.["@context"]).toBe("https://schema.org");
    expect(site?.name).toBe("Easy Plant Life");
    expect(site?.url).toBe("https://easyplantlife.com");
  });
});
