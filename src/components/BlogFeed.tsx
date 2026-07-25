import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCachedPosts } from '../utils/useCachedPosts';
import PostCard from './PostCard';
import { HiSearch, HiX } from 'react-icons/hi';
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isPillSticky, setIsPillSticky] = useState(false);
  const [searchActive, setSearchActive] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const filterButtonsRef = useRef<HTMLDivElement>(null);
  const filterNaturalWidthRef = useRef<number>(0);
  const lastScrollY = useRef(0);
  const pillActiveRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;

      const sentinelTop = sentinelRef.current.getBoundingClientRect().top;
      const pastThreshold = sentinelTop <= 0;
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      const shouldShowPill = pastThreshold ? scrollingDown : false;

      if (shouldShowPill !== pillActiveRef.current) {
        pillActiveRef.current = shouldShowPill;
        setIsPillSticky(shouldShowPill);
        window.dispatchEvent(
          new CustomEvent('navbar-visibility', { detail: { hidden: shouldShowPill } })
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = filterButtonsRef.current;
    if (!el) return;

    if (searchActive) {
      if (filterNaturalWidthRef.current === 0) {
        filterNaturalWidthRef.current = el.offsetWidth;
      }
      gsap.to(el, {
        width: 0,
        opacity: 0,
        marginLeft: 0,
        duration: 0.3,
        ease: 'power2.in',
        overflow: 'hidden',
      });
    } else {
      gsap.to(el, {
        width: filterNaturalWidthRef.current || 'auto',
        opacity: 1,
        marginLeft: '0.5rem',
        duration: 0.35,
        ease: 'power2.out',
      });
    }
  }, [searchActive]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchActive(false);
    searchInputRef.current?.blur();
  };

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
      <div ref={sentinelRef} className="search-sentinel" />

      <div className={`search-bar-sticky ${isPillSticky ? 'pill-mode' : ''}`}>
        <div className="search-container">
          <div className="search-input-wrapper">
            <button
              type="button"
              className="search-icon-btn"
              onClick={() => {
                setSearchActive(true);
                searchInputRef.current?.focus();
              }}
              aria-label="Search"
            >
              <HiSearch />
            </button>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setSearchActive(true)}
              onBlur={() => {
                if (searchTerm.trim() === '') setSearchActive(false);
              }}
              className="search-input"
            />
            {(searchActive || searchTerm.trim() !== '') && (
              <button
                type="button"
                className="clear-search-btn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                <HiX />
              </button>
            )}
          </div>

          <div className="filter-buttons" ref={filterButtonsRef}>
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