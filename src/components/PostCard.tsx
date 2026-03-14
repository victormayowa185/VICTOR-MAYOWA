import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import '../styles/postCard.css';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    excerpt: string;
    slug: { current: string };
    categories?: { title: string }[];
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

  const hasUploadedImage = !!post.mainImage;
  const imageSrc = hasUploadedImage
    ? urlFor(post.mainImage).width(400).height(250).url()
    : (post.categories && post.categories[0] && defaultImageMap[post.categories[0]]) || fallbackDefaultImage;

  const handleImageDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newHeart = { id: Date.now(), x, y };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  const handleCardDoubleClick = () => {
    navigate(`/post/${post.slug.current}`);
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
    <div className="post-card" onDoubleClick={handleCardDoubleClick}>
      {/* Header row with love button */}
      <div className="post-card-header">
        <button className="love-button" onClick={handleLoveClick}>
          {loved ? <FaHeart color="black" /> : <FiHeart color="white" />}
        </button>
      </div>

      {/* Main content row (image + text) */}
      <div className={`post-card-main ${imagePositionClass}`}>
        <div className="post-image-wrapper" onDoubleClick={handleImageDoubleClick}>
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