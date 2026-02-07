// sanity/lib/queries.ts
import { groq } from "next-sanity";

export const PROJECTS_QUERY = groq`*[_type == "project"]{
  _id,
  title,
  category,
  location,
  "image": image.asset->url,
  concept,
  area
}`;