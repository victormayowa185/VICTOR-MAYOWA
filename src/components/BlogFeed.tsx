import { useState, useEffect } from 'react';
import { client } from '../sanity/client';
import PostCard from './PostCard';
import type { SanityImageSource } from '@sanity/image-url'; // ✅ simplified import
import '../styles/blogFeed.css';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  categories?: string[];          // array of strings (category titles)
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  excerpt,
  slug,
  "categories": categories[]->title,   // returns array of strings
  mainImage,  
  liveDemoUrl,
  publishedAt
}`;

const defaultImageMap: Record<string, string> = {
  React: '/defaults/react.png',
  CSS: '/defaults/css.png',
  News: '/defaults/news.png',
  JavaScript: '/defaults/javascript.png',
  Fun: '/defaults/fun.png',
};
const fallbackDefaultImage = '/defaults/default.png';

const BlogFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    client.fetch(POSTS_QUERY)
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Sanity fetch error:', err);
        setLoading(false);
      });
  }, []);

  const filteredPosts = posts.filter(post => {
    // Category filter (unchanged)
    const matchesCategory = filter === 'all' ||
      (post.categories && post.categories.some(cat => cat.toUpperCase() === filter.toUpperCase()));

    // Search logic
    let matchesSearch = true;
    if (searchTerm.trim() !== '') {
      // Define stop words (common words you want to ignore)
      const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'was', 'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those']);

      // Split into words, convert to lowercase, filter out stop words
      const keywords = searchTerm.toLowerCase().split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word));

      // If no meaningful keywords, show all posts (or you could still fall back to full match)
      if (keywords.length === 0) {
        // Fallback: use the whole search term as one keyword
        keywords.push(searchTerm.toLowerCase());
      }

      // Prepare text to search (title + excerpt + categories)
      const textToSearch = `${post.title.toLowerCase()} ${post.excerpt?.toLowerCase() || ''} ${post.categories?.join(' ') || ''}`;

      // Check if any meaningful keyword exists in the text
      matchesSearch = keywords.some(keyword => textToSearch.includes(keyword));
    }

    return matchesCategory && matchesSearch;
  });

  if (loading) return <p className="loading-message">Loading posts...</p>;

  return (
    <div className="blog-feed">
      <div className="search-bar-sticky">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            {['all', 'React', 'CSS', 'News', 'JavaScript'].map(cat => (
              <button
                key={cat}
                className={filter === cat ? 'active' : ''}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="posts-feed">
        {filteredPosts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            defaultImageMap={defaultImageMap}
            fallbackDefaultImage={fallbackDefaultImage}
          />
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <p className="no-posts-message">No posts match your criteria.</p>
      )}
    </div>
  );
};

export default BlogFeed;