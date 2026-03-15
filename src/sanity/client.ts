import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Use environment variables with fallbacks for TypeScript
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID || '';
const dataset = import.meta.env.VITE_SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production';

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-03-13',
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);