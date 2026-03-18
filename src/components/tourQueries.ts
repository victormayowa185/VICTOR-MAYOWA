// src/constants/tourQueries.ts
export const TOUR_QUERY = `*[_type == "post" && "TOUR" in categories[]->title] | order(publishedAt asc){
  _id,
  title,
  excerpt,
  slug,
  mainImage,
  liveDemoUrl,
  publishedAt
}`;