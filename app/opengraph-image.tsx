import { ImageResponse } from "next/og";

// Site-wide Open Graph / social card. Next.js applies this as the default
// og:image (and, via twitter-image, the Twitter card) for every route that
// doesn't define its own. Rendered with the site's dark palette.
export const alt = "Syed Ahammad — Full-stack developer in Dubai";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1622",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Coral accent bar */}
        <div style={{ display: "flex", width: "120px", height: "10px", background: "#ff6b5c", borderRadius: "9999px" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              color: "#5ec4b6",
              fontSize: "28px",
              letterSpacing: "6px",
              textTransform: "uppercase",
            }}
          >
            / full-stack developer
          </div>
          <div
            style={{
              display: "flex",
              color: "#ece7df",
              fontSize: "96px",
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            Syed Ahammad
          </div>
          <div
            style={{
              display: "flex",
              color: "#8ea0b2",
              fontSize: "40px",
              lineHeight: 1.3,
            }}
          >
            I build full-stack products that ship.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#8ea0b2",
            fontSize: "30px",
          }}
        >
          <div style={{ display: "flex", color: "#ece7df", fontWeight: 600 }}>syed.dev</div>
          <div style={{ display: "flex" }}>Next.js · MongoDB · TypeScript · Dubai</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
