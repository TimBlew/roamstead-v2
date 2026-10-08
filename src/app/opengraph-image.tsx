import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "Roamstead | Modern Mountain Hospitality";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [mountain, logo] = await Promise.all([
    readFile(path.join(process.cwd(), "public/images/hero-mountain-optimized.jpg")),
    readFile(path.join(process.cwd(), "public/roamstead-logo.svg"), "utf8"),
  ]);
  // Preserve the original brand mark exactly. Recolor only its existing fill for contrast.
  const whiteLogo = logo.replace(/#4a6e56/gi, "#FFFFFF");
  const logoSrc = `data:image/svg+xml;base64,${Buffer.from(whiteLogo).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1F3125",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${Buffer.from(mountain).toString("base64")}`}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(13,29,21,0.03) 18%, rgba(13,29,21,0.16) 47%, rgba(13,29,21,0.78) 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: "0 76px 64px",
            width: "100%",
          }}
        >
          <img src={logoSrc} alt="Roamstead" width={360} height={87} style={{ objectFit: "contain", objectPosition: "left" }} />
          <div style={{ color: "#FFFFFF", fontSize: 37, fontWeight: 400, marginTop: 16, letterSpacing: "-0.8px" }}>
            Modern Mountain Hospitality
          </div>
        </div>
      </div>
    ),
    size
  );
}
