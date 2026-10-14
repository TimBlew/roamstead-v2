import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Email clients widely support PNG; render the exact approved light SVG without changing its paths.
export async function GET() {
  const logo = await readFile(path.join(process.cwd(), "public/roamstead-logo-light.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`;
  return new ImageResponse(
    <div style={{ display: "flex", width: 400, height: 120, alignItems: "center", justifyContent: "center" }}>
      <img src={src} alt="Roamstead" width={380} height={114} />
    </div>,
    { width: 400, height: 120, headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" } },
  );
}
