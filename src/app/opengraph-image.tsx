import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Easy Plant Life - A calm approach to plant-based living";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Default Open Graph image for Easy Plant Life
 *
 * Displays a calm, minimal branded image with:
 * - Soft green accent (brand color)
 * - Clean typography
 * - The brand tagline
 *
 * This image is used when pages don't specify their own OG image.
 */
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#FAFAF8",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "serif",
      }}
    >
      {/* Decorative leaf/heart shape - brand mark */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50% 50% 50% 0",
          background: "linear-gradient(135deg, #7BA05B 0%, #5C8A3E 100%)",
          marginBottom: 40,
          transform: "rotate(-45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50% 50% 50% 0",
            background: "#FAFAF8",
            opacity: 0.3,
          }}
        />
      </div>

      {/* Brand name */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 600,
          color: "#2D3A24",
          marginBottom: 16,
          letterSpacing: "-0.02em",
        }}
      >
        Easy Plant Life
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: 32,
          color: "#5C6B52",
          letterSpacing: "0.02em",
        }}
      >
        A calm approach to plant-based living
      </div>
    </div>,
    {
      ...size,
    }
  );
}
