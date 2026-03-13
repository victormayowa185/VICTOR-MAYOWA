import { useState, useEffect } from 'react';
import { client } from '../sanity/client';
import PostCard from './PostCard';
import '../styles/blog.css';

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  slug: { current: string };
  categories?: { title: string }[];
  mainImage?: any;
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
    const matchesCategory = filter === 'all' || (post.categories && post.categories.includes(filter));
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
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
            {['all', 'React', 'CSS', 'News', 'JavaScript', 'Fun'].map(cat => (
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