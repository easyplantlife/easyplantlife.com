/**
 * Home Page JSON-LD Integration Tests
 *
 * Tests that the home page includes proper JSON-LD structured data
 * for Organization and WebSite schemas.
 */

import { render } from "@testing-library/react";
import Home from "@/app/page";

/**
 * Helper function to extract all JSON-LD data from rendered component
 */
function getAllJsonLdData(container: HTMLElement): unknown[] {
  const scripts = container.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  return Array.from(scripts).map((script) =>
    JSON.parse(script.textContent || "{}")
  );
}

describe("Home Page JSON-LD", () => {
  it("includes Organization JSON-LD", () => {
    const { container } = render(<Home />);
    const jsonLdData = getAllJsonLdData(container);
    const organizationData = jsonLdData.find(
      (data) => (data as { "@type"?: string })?.["@type"] === "Organization"
    );
    expect(organizationData).toBeDefined();
  });

  it("includes WebSite JSON-LD", () => {
    const { container } = render(<Home />);
    const jsonLdData = getAllJsonLdData(container);
    const websiteData = jsonLdData.find(
      (data) => (data as { "@type"?: string })?.["@type"] === "WebSite"
    );
    expect(websiteData).toBeDefined();
  });

  it("Organization schema has correct structure", () => {
    const { container } = render(<Home />);
    const jsonLdData = getAllJsonLdData(container);
    const organizationData = jsonLdData.find(
      (data) => (data as { "@type"?: string })?.["@type"] === "Organization"
    ) as {
      "@context"?: string;
      "@type"?: string;
      name?: string;
      url?: string;
    };

    expect(organizationData?.["@context"]).toBe("https://schema.org");
    expect(organizationData?.name).toBe("Easy Plant Life");
    expect(organizationData?.url).toBe("https://easyplantlife.com");
  });

  it("WebSite schema has correct structure", () => {
    const { container } = render(<Home />);
    const jsonLdData = getAllJsonLdData(container);
    const websiteData = jsonLdData.find(
      (data) => (data as { "@type"?: string })?.["@type"] === "WebSite"
    ) as {
      "@context"?: string;
      "@type"?: string;
      name?: string;
      url?: string;
    };

    expect(websiteData?.["@context"]).toBe("https://schema.org");
    expect(websiteData?.name).toBe("Easy Plant Life");
    expect(websiteData?.url).toBe("https://easyplantlife.com");
  });
});
