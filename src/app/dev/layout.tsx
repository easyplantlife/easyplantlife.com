import type { Metadata } from "next";

/** Internal pages: reachable, but never indexed. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
