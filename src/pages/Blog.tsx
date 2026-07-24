import React, { useEffect, useState } from 'react';
import BlogFeed from '../components/BlogFeed';
import '../styles/blog.css';

interface NewsArticle {
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
}

// Foundation fallback pool — swap these paths once you drop your ~10 curated
// images into /public/news-fallback/. Using existing public images for now
// so the feature works end-to-end today.
const FALLBACK_IMAGES = ['/pic2.png', '/picc.png', '/see.png', '/1.png'];

const getRandomFallback = () =>
    FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

const Hero: React.FC = () => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [bgImage, setBgImage] = useState<string>(getRandomFallback());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        fetch('/api/news')
            .then((res) => {
                if (!res.ok) throw new Error('News fetch failed');
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;
                if (data.article && data.article.urlToImage) {
                    setArticle(data.article);
                    setBgImage(data.article.urlToImage);
                } else {
                    setBgImage(getRandomFallback());
                }
            })
            .catch(() => {
                if (isMounted) setBgImage(getRandomFallback());
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div>
            <h1 className="visually-hidden">Victor Mayowa – Web Developer & Designer Blog</h1>

            <div
                className="news-hero"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-label="Latest trending tech news"
            >
                <div className="news-hero-overlay" />
                <div className="news-hero-content">
                    <span className="news-hero-tag">
                        {loading ? 'Loading latest tech news…' : 'Trending in Tech'}
                    </span>

                    <h2 className="news-hero-headline">
                        {article ? article.title : 'Stay tuned for the latest in tech'}
                    </h2>

                    {article?.description && (
                        <p className="news-hero-desc">{article.description}</p>
                    )}

                    {article?.url && (
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-hero-cta"
                        >
                            Read Full Article
                        </a>
                    )}
                </div>
            </div>

            <BlogFeed />
        </div>
    );
};

export default Hero;