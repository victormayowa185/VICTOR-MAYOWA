import { useState, useEffect } from 'react';
import { client } from '../sanity/client';
import type { SanityImageSource } from '@sanity/image-url';

export interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  categories?: string[];
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  excerpt,
  slug,
  "categories": categories[]->title,
  mainImage,  
  liveDemoUrl,
  publishedAt
}`;

let cachedPosts: Post[] | null = null;
let fetchPromise: Promise<Post[]> | null = null;

export const useCachedPosts = () => {
  const [posts, setPosts] = useState<Post[]>(cachedPosts || []);
  const [loading, setLoading] = useState(!cachedPosts);

  useEffect(() => {
    if (cachedPosts) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPosts(cachedPosts);
       
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = client.fetch(POSTS_QUERY).then(data => {
        cachedPosts = data;
        fetchPromise = null;
        return data;
      });
    }

    fetchPromise.then(data => {
       
      setPosts(data);
       
      setLoading(false);
    });
  }, []);

  return { posts, loading };
};