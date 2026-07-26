import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { client, urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/react';
import type { SanityImageSource } from '@sanity/image-url';
import gsap from 'gsap';
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

  const mediaRef = useRef<HTMLDivElement | HTMLImageElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const excerptRef = useRef<HTMLParagraphElement>(null);
  const timeRef = useRef<HTMLTimeElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasPlayedEntrance = useRef(false);
  const preloaderDone = useRef(false);

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

  // ---------- Entrance: waits for BOTH the Preloader and the post data ----------
  useEffect(() => {
    const tryPlayEntrance = () => {
      if (hasPlayedEntrance.current) return;
      if (!preloaderDone.current) return;
      if (loading || !post) return;

      hasPlayedEntrance.current = true;

      gsap.set(mediaRef.current, { opacity: 0, y: 20, scale: 0.98 });
      gsap.set(
        [titleRef.current, excerptRef.current, timeRef.current, ctaRef.current],
        { opacity: 0, y: 20 }
      );
      gsap.set(bodyRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({ delay: 0.1 });
      if (mediaRef.current) {
        tl.to(mediaRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out' });
      }
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, mediaRef.current ? '-=0.4' : 0)
        .to(excerptRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .to(timeRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3')
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.25')
        .to(bodyRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
    };

    const handlePreloaderFinished = () => {
      preloaderDone.current = true;
      tryPlayEntrance();
    };

    if ((window as any).__preloaderFinished) {
      preloaderDone.current = true;
    } else {
      window.addEventListener('preloader-finished', handlePreloaderFinished);
    }

    tryPlayEntrance();

    return () => window.removeEventListener('preloader-finished', handlePreloaderFinished);
  }, [loading, post]);

  if (loading) return <p className="loading-message">Loading post...</p>;
  if (!post) return <p className="error-message">Post not found</p>;

  const videoEmbedUrl = post.liveDemoUrl ? getVideoEmbedUrl(post.liveDemoUrl) : null;

  const postUrl = `${window.location.origin}/post/${slug}`;
  const imageUrl = post.mainImage
    ? urlFor(post.mainImage).width(1200).url()
    : `${window.location.origin}/default-og-image.png`;

  return (
    <>
      <Helmet>
        <title>{post.title} | Victor Mayowa's Blog</title>
        <meta name="description" content={post.excerpt} />

        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Victor Mayowa's Blog" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>

      <article className="post-detail">
        {videoEmbedUrl ? (
          <div className="video-wrapper" ref={mediaRef as React.RefObject<HTMLDivElement>}>
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
              ref={mediaRef as React.RefObject<HTMLImageElement>}
            />
          )
        )}

        <h1 ref={titleRef}>{post.title}</h1>
        <p className="detail-excerpt" ref={excerptRef}>{post.excerpt}</p>
        <time className="detail-time" ref={timeRef}>{timeAgo(post.publishedAt)}</time>

        {post.liveDemoUrl && !videoEmbedUrl && (
          <a
            href={post.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="visit-site-btn"
            ref={ctaRef}
          >
            Visit Site
          </a>
        )}

        <div className="detail-body" ref={bodyRef}>
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