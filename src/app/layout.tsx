import type { Metadata, Viewport } from "next";
import { Lora, Source_Sans_3 } from "next/font/google";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const headingFont = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

/**
 * Site-wide default metadata configuration
 *
 * These defaults apply to all pages unless overridden:
 * - Title template: "Page Title | Easy Plant Life"
 * - Default description for brand messaging
 * - Open Graph defaults for social sharing
 * - Twitter card configuration
 * - Favicon and Apple touch icon
 */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://easyplantlife.com"
  ),
  title: {
    default: "Easy Plant Life",
    template: "%s | Easy Plant Life",
  },
  description:
    "A calm approach to plant-based living. Simple, sustainable guidance without complexity or perfection.",
  openGraph: {
    type: "website",
    siteName: "Easy Plant Life",
    locale: "en_US",
    // Note: opengraph-image.tsx will be auto-discovered by Next.js
    // and merged with this configuration
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Easy Plant Life - A calm approach to plant-based living",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "any" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} flex min-h-screen flex-col antialiased`}
      >
        <GoogleAnalytics />
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
