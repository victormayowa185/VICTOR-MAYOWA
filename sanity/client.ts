import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-03-13',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: any) => builder.image(source);