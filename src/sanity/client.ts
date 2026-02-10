import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
});

const builder = imageUrlBuilder(client);

// Accept "any" here to avoid type-export issues across versions.
// We still get correct runtime behavior.
export function urlFor(source: any) {
  return builder.image(source);
}
