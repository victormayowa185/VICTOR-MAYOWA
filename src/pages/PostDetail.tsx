import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client, urlFor } from '../sanity/client';
import { timeAgo } from '../components/dateFormatter';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from '@sanity/types';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import '../styles/postDetail.css'; 

interface Post {
  title: string;
  excerpt: string;
  body: PortableTextBlock[]; 
  mainImage?: SanityImageSource;
  publishedAt: string;
}

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
        publishedAt
      }`;
      const data = await client.fetch(query, { slug });
      console.log('Fetched post:', data);
      setPost(data);
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <p className="loading-message">Loading post...</p>;
  if (!post) return <p className="error-message">Post not found</p>;

  return (
    <article className="post-detail">
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).width(1200).url()}
          alt={post.title}
          className="detail-image"
        />
      )}
      <h1>{post.title}</h1>
      <p className="detail-excerpt">{post.excerpt}</p>
      <time className="detail-time">{timeAgo(post.publishedAt)}</time>
      <div className="detail-body">
        {post.body ? (
          <PortableText value={post.body} />
        ) : (
          <p>This post has no content yet.</p>
        )}
      </div>
    </article>
  );
};

export default PostDetail;