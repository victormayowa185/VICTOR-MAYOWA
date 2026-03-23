import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import type { SanityImageSource } from '@sanity/image-url';
import '../styles/postCard.css';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    slug: { current: string };
    categories?: string[];
    mainImage?: SanityImageSource;
    liveDemoUrl?: string;
    publishedAt: string;
  };
  defaultImageMap: Record<string, string>;
  fallbackDefaultImage: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, defaultImageMap, fallbackDefaultImage }) => {
  const navigate = useNavigate();
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [loved, setLoved] = useState(false);
  const navigateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // ✅ fixed

  const hasUploadedImage = !!post.mainImage;
  const imageSrc = hasUploadedImage
    ? urlFor(post.mainImage!).width(400).height(250).url()
    : (post.categories && post.categories[0] && defaultImageMap[post.categories[0]]) || fallbackDefaultImage;

  const handleCardClick = () => {
    if (navigateTimeoutRef.current) return;
    navigateTimeoutRef.current = setTimeout(() => {
      navigate(`/post/${post.slug.current}`);
      navigateTimeoutRef.current = null;
    }, 200);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (navigateTimeoutRef.current) {
      clearTimeout(navigateTimeoutRef.current);
      navigateTimeoutRef.current = null;

      setLoved(prev => !prev);

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newHeart = { id: Date.now(), x, y };
      setHearts(prev => [...prev, newHeart]);
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    } else {
      navigateTimeoutRef.current = setTimeout(() => {
        navigate(`/post/${post.slug.current}`);
        navigateTimeoutRef.current = null;
      }, 200);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post.slug.current}`;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url });
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
    }
  };

  const handleLoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoved(prev => !prev);
  };

  const imagePositionClass = hasUploadedImage ? 'image-right' : 'image-left';

  return (
    <div className="post-card" onClick={handleCardClick}>
      <div className="post-card-header">
        <button className="love-button" onClick={handleLoveClick}>
          {loved ? <FaHeart color="black" /> : <FiHeart color="black" />}
        </button>
      </div>

      <div className={`post-card-main ${imagePositionClass}`}>
        <div className="post-image-wrapper" onClick={handleImageClick}>
          <img src={imageSrc} alt={post.title} className="post-image animate-image" />
          {hearts.map(heart => (
            <span key={heart.id} className="heart" style={{ left: heart.x, top: heart.y }}>❤️</span>
          ))}
        </div>

        <div className="post-content">
          <h3>{post.title}</h3>
          <p className="excerpt">{post.excerpt}</p>
          <div className="post-footer">
            <div className="action-buttons">
              {post.liveDemoUrl && (
                <a
                  href={post.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link-btn"
                  onClick={e => e.stopPropagation()}
                >
                  Visit Site
                </a>
              )}
              <button className="share-btn" onClick={handleShare}>
                Share
              </button>
            </div>
            <span className="timestamp">{timeAgo(post.publishedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;