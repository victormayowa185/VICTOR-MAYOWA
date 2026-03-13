import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { urlFor } from '../sanity/client'
import { timeAgo } from '../components/dateFormatter'
import '../styles/blog.css'

interface PostCardProps {
  post: {
    _id: string
    title: string
    excerpt: string
    slug: { current: string }
    categories?: { title: string }[]
    mainImage?: any
    liveDemoUrl?: string
    publishedAt: string
  }
  defaultImageMap: Record<string, string>
  fallbackDefaultImage: string
}

const PostCard: React.FC<PostCardProps> = ({ post, defaultImageMap, fallbackDefaultImage }) => {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])

  // Determine image source
  const hasUploadedImage = !!post.mainImage
  const imageSrc = hasUploadedImage
    ? urlFor(post.mainImage).width(400).height(250).url()
    : (post.categories && post.categories[0] && defaultImageMap[post.categories[0]]) || fallbackDefaultImage

  // Handle double‑tap on image for heart animation
  const handleImageDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newHeart = { id: Date.now(), x, y }
    setHearts(prev => [...prev, newHeart])
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id))
    }, 1000)
  }

  // Navigate to post detail on double‑click elsewhere
  const handleCardDoubleClick = () => {
    navigate(`/post/${post.slug.current}`)
  }

  // Toggle excerpt expansion
  const toggleExcerpt = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => !prev)
  }

  // Share handler
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `${window.location.origin}/post/${post.slug.current}`
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url })
    } else {
      navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
    }
  }

  // Determine image placement class
  const imagePositionClass = hasUploadedImage ? 'image-right' : 'image-left'

  return (
    <div className={`post-card ${imagePositionClass}`} onDoubleClick={handleCardDoubleClick}>
      {/* Category badge */}
      {post.categories && post.categories[0] && (
        <span className="category-badge">{post.categories[0]}</span>
      )}

      {/* Image side */}
      <div className="post-image-wrapper" onDoubleClick={handleImageDoubleClick}>
        <img src={imageSrc} alt={post.title} className="post-image" />
        {/* Floating hearts */}
        {hearts.map(heart => (
          <span
            key={heart.id}
            className="heart"
            style={{ left: heart.x, top: heart.y }}
          >
            ❤️
          </span>
        ))}
      </div>

      {/* Content side */}
      <div className="post-content">
        <h3>{post.title}</h3>
        <p className={`excerpt ${expanded ? 'expanded' : ''}`} onClick={toggleExcerpt}>
          {post.excerpt}
        </p>
        {/* Footer row (buttons + timestamp) */}
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
  )
}

export default PostCard