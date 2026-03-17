// src/components/TourOverlay.tsx
import React from 'react';
import { useTour } from '../components/TourContext';
import PostCard from './PostCard';
import '../styles/tourOverlay.css';

// Default image maps – same as in BlogFeed (you could also import from a shared config)
const defaultImageMap: Record<string, string> = {
  React: '/defaults/react.png',
  CSS: '/defaults/css.png',
  News: '/defaults/news.png',
  JavaScript: '/defaults/javascript.png',
  Fun: '/defaults/fun.png',
};
const fallbackDefaultImage = '/defaults/default.png';

const TourOverlay: React.FC = () => {
  const { isTourActive, tourPosts, currentIndex, nextPost, prevPost, endTour, loading } = useTour();

  if (!isTourActive || loading || tourPosts.length === 0) return null;

  const currentPost = tourPosts[currentIndex];

  return (
    <div className="tour-overlay">
      <div className="tour-overlay-content">
        <div className="tour-header">
          <span className="tour-lightbulb">💡 Tour</span>
          <button className="tour-close" onClick={endTour}>✕</button>
        </div>

        <div className="tour-card-wrapper">
          <PostCard
            post={currentPost}
            defaultImageMap={defaultImageMap}
            fallbackDefaultImage={fallbackDefaultImage}
          />
        </div>

        <div className="tour-navigation">
          <button
            className="tour-nav-btn"
            onClick={prevPost}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <span className="tour-counter">
            {currentIndex + 1} / {tourPosts.length}
          </span>
          <button
            className="tour-nav-btn"
            onClick={nextPost}
            disabled={currentIndex === tourPosts.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourOverlay;