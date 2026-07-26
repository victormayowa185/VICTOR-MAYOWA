import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; 
import { client, urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url';
import '../styles/postDetail.css';

interface Post {
  title: string;
  excerpt: string;
  body: PortableTextBlock[];
  mainImage?: SanityImageSource;
  liveDemoUrl?: string;
  publishedAt: string;
}

// Helper to detect and convert video URLs
const getVideoEmbedUrl = (url: string) => {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
};

const PostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const query = `*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        body,
        mainImage,
        liveDemoUrl,
        publishedAt
      }`;
      const data = await client.fetch(query, { slug });
      setPost(data);
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <p className="loading-message">Loading post...</p>;
  if (!post) return <p className="error-message">Post not found</p>;

  const videoEmbedUrl = post.liveDemoUrl ? getVideoEmbedUrl(post.liveDemoUrl) : null;

  // Build absolute URLs for meta tags
  const postUrl = `${window.location.origin}/post/${slug}`;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : `${window.location.origin}/default-og-image.png`; // fallback – replace with your actual default image path

  return (
    <>
      <Helmet>
        {/* Standard meta tags */}
        <title>{post.title} | Victor Mayowa's Blog</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Victor Mayowa's Blog" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <article className="post-detail">
        {/* Video or Image – video takes priority */}
        {videoEmbedUrl ? (
          <div className="video-wrapper">
            <iframe
              src={videoEmbedUrl}
              title={post.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          post.mainImage && (
            <img
              src={urlFor(post.mainImage).width(1200).url()}
              alt={post.title}
              className="detail-image"
            />
          )
        )}

        <h1>{post.title}</h1>
        <p className="detail-excerpt">{post.excerpt}</p>
        <time className="detail-time">{timeAgo(post.publishedAt)}</time>

        {/* Show "Visit Site" button only if it's not a video link */}
        {post.liveDemoUrl && !videoEmbedUrl && (
          <a
            href={post.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-site-btn"
          >
            Visit Site
          </a>
        )}

        <div className="detail-body">
          {post.body ? (
            <PortableText value={post.body} />
          ) : (
            <p>This post has no content yet.</p>
          )}
        </div>
      </article>
    </>
  );
};

export default PostDetail;