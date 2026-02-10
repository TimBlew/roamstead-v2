import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

if (!projectId || !dataset) {
  console.warn("Missing Sanity env vars. Check Vercel Environment Variables.");
}

export const client = createClient({
  projectId: projectId || "missing",
  dataset: dataset || "missing",
  apiVersion,
  useCdn: true,
});