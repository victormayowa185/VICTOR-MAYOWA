import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET || process.env.REACT_APP_SANITY_DATASET || 'production',
  apiVersion: '2024-03-13',
  useCdn: true,
});

const builder = createImageUrlBuilder(client);
export const urlFor = (source: SanityImageSource) => builder.image(source);