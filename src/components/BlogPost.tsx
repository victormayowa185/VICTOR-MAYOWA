import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/blog.css';

// Dummy post data – replace with your real data source
const postsData = [
  {
    id: 1,
    title: 'Getting Started with React',
    excerpt: 'Learn the basics of React and build your first component.',
    category: 'react',
    image: '/images/react.jpg', // placeholder path
    liveDemo: 'https://codesandbox.io/s/react-demo',
  },
  {
    id: 2,
    title: 'Advanced CSS Techniques',
    excerpt: 'Master Flexbox, Grid, and modern layout methods.',
    category: 'css',
    image: '/images/css.jpg',
    liveDemo: null, // no live demo for this post
  },
  {
    id: 3,
    title: 'What’s New in Next.js 14',
    excerpt: 'Explore the latest features in the React framework.',
    category: 'news',
    image: '/images/next.jpg',
    liveDemo: 'https://github.com/example/next-demo',
  },
  // add more posts...
];

const Blog: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'react', 'css', 'news'

  // Filter posts based on search and category
  const filteredPosts = postsData.filter((post) => {
    const matchesCategory = filter === 'all' || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle double‑click on a post card
  const handleDoubleClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  // Share function
  const handleShare = (post: typeof postsData[0]) => {
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      // Use Web Share API if available (mobile)
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url,
      }).catch(() => {
        // user cancelled or sharing failed – fallback to copy link
        copyLink(url);
      });
    } else {
      // Fallback: show custom share popup (simplified – copy link)
      copyLink(url);
    }
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <div className="blog-section">
      {/* Sticky search bar */}
      <div className="search-bar-sticky">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'react' ? 'active' : ''}
              onClick={() => setFilter('react')}
            >
              React
            </button>
            <button
              className={filter === 'css' ? 'active' : ''}
              onClick={() => setFilter('css')}
            >
              CSS
            </button>
            <button
              className={filter === 'news' ? 'active' : ''}
              onClick={() => setFilter('news')}
            >
              News
            </button>
          </div>
        </div>
      </div>

      {/* Posts grid */}
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            onDoubleClick={() => handleDoubleClick(post.id)}
          >
            {post.image && (
              <img src={post.image} alt={post.title} className="post-image" />
            )}
            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="post-actions">
                {post.liveDemo && (
                  <a
                    href={post.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="live-demo-btn"
                    onClick={(e) => e.stopPropagation()} // prevent double‑click
                  >
                    Live Demo
                  </a>
                )}
                <button
                  className="share-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double‑click
                    handleShare(post);
                  }}
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;