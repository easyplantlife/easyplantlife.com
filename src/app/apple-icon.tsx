import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Apple Touch Icon for Easy Plant Life
 *
 * A 180x180 icon used on Apple devices when the site is added to the home screen.
 * Features the brand mark (green heart/leaf shape) on a light background.
 */
export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#FAFAF8",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Brand mark - leaf/heart shape */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50% 50% 50% 0",
          background: "linear-gradient(135deg, #7BA05B 0%, #5C8A3E 100%)",
          transform: "rotate(-45deg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: "50% 50% 50% 0",
            background: "#FAFAF8",
            opacity: 0.3,
          }}
        />
      </div>
    </div>,
    {
      ...size,
    }
  );
}
