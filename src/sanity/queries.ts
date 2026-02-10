import { groq } from "next-sanity";

export const testQuery = groq`*[_type == "property"][0]{ _id, name }`;

