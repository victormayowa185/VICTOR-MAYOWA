import { useState } from 'react'; // useEffect no longer needed
import { useCachedPosts } from '../utils/useCachedPosts';
import PostCard from './PostCard';
import '../styles/blogFeed.css';

const defaultImageMap: Record<string, string> = {
  React: '/defaults/react.png',
  CSS: '/defaults/css.png',
  News: '/defaults/news.png',
  JavaScript: '/defaults/javascript.png',
  Fun: '/defaults/fun.png',
};
const fallbackDefaultImage = '/defaults/default.png';

const BlogFeed = () => {
  const { posts, loading } = useCachedPosts(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filter === 'all' ||
      (post.categories && post.categories.some(cat => cat.toUpperCase() === filter.toUpperCase()));

    let matchesSearch = true;
    if (searchTerm.trim() !== '') {
      const stopWords = new Set(['a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'for', 'in', 'is', 'it', 'of', 'on', 'or', 'the', 'to', 'was', 'what', 'how', 'why', 'when', 'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those']);
      const keywords = searchTerm.toLowerCase().split(/\s+/)
        .filter(word => word.length > 1 && !stopWords.has(word));
      if (keywords.length === 0) keywords.push(searchTerm.toLowerCase());
      const textToSearch = `${post.title.toLowerCase()} ${post.excerpt?.toLowerCase() || ''} ${post.categories?.join(' ') || ''}`;
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