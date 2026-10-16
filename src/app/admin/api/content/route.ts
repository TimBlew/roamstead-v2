import { NextRequest, NextResponse } from "next/server";
import { adminAuthenticated } from "@/lib/admin-auth";
import initial from "@/data/admin-copy.json";

export const dynamic = "force-dynamic";
const owner = "TimBlew", repository = "roamstead-v2";
const file = "src/data/admin-copy.json";
const base = `https://api.github.com/repos/${owner}/${repository}/contents/${file}`;
const fieldLimits: Record<string, number> = {
  "homepage.headline.0": 75, "homepage.headline.1": 75,
  "homepage.description.0": 300, "homepage.description.1": 180,
  "properties.intro": 360,
  "hooks.hygge-house": 200, "hooks.granary": 200,
  "hooks.lowell": 200, "hooks.powder-room": 200,
};
function response(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}
function getToken() { return process.env.ROAMSTEAD_EDITOR_GITHUB_TOKEN || ""; }
function validOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  return Boolean(origin && new URL(origin).host === req.headers.get("host") && new URL(origin).protocol === "https:");
}
async function fetchFile() {
  const token = getToken(); if (!token) return null;
  const r = await fetch(base + "?ref=main", { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, cache: "no-store" });
  if (!r.ok) throw new Error(`GitHub read failed: ${r.status}`);
  const j = await r.json();
  return { sha: String(j.sha), copy: JSON.parse(Buffer.from(String(j.content).replace(/\\n/g, ""), "base64").toString("utf8")) };
}
export async function GET() {
  if (!await adminAuthenticated()) return response({ error: "Unauthorized" }, 401);
  try {
    const remote = await fetchFile();
    return response(remote ? { ...remote, editing: true } : { copy: initial, editing: false, message: "Content editing requires a repository-scoped GitHub token." });
  } catch { return response({ error: "Editor source temporarily unavailable." }, 503); }
}
export async function PUT(req: NextRequest) {
  if (!await adminAuthenticated()) return response({ error: "Unauthorized" }, 401);
  if (!validOrigin(req)) return response({ error: "Origin verification failed." }, 403);
  if (!getToken()) return response({ error: "Editor token not configured." }, 503);
  let payload: { sha?: string; values?: Record<string, string> };
  try { payload = await req.json(); } catch { return response({ error: "Invalid JSON." }, 400); }
  if (!payload.sha || !payload.values || Object.keys(payload.values).length !== Object.keys(fieldLimits).length) return response({ error: "Incomplete content fields." }, 400);
  for (const [key, max] of Object.entries(fieldLimits)) {
    const value = payload.values[key];
    if (typeof value !== "string" || !value.trim() || value.length > max || /[<>]/.test(value)) return response({ error: "Invalid value for " + key }, 400);
  }
  try {
    const current = await fetchFile();
    if (!current || current.sha !== payload.sha) return response({ error: "The site copy has changed since it was loaded. Refresh before saving." }, 409);
    const copy = structuredClone(current.copy);
    for (const [key, value] of Object.entries(payload.values)) {
      if (!(key in fieldLimits)) return response({ error: "Unknown field." }, 400);
      const parts = key.split(".");
      let target: any = copy;
      for (const part of parts.slice(0, -1)) target = target[part];
      target[parts[parts.length - 1]] = value.trim();
    }
    const content = Buffer.from(JSON.stringify(copy, null, 2) + "\n").toString("base64");
    const r = await fetch(base, { method: "PUT", headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" }, body: JSON.stringify({ message: "Update approved Roamstead website copy via admin editor", content, sha: current.sha, branch: "main" }), cache: "no-store" });
    if (r.status === 409 || r.status === 422) return response({ error: "Concurrent change detected. Reload and try again." }, 409);
    if (!r.ok) return response({ error: "Publishing service rejected the save." }, 503);
    const saved = await r.json();
    return response({ saved: true, sha: saved.content?.sha, commit: saved.commit?.sha, message: "Saved to GitHub. Vercel is deploying the change." });
  } catch { return response({ error: "Unable to save at this time." }, 503); }
}
