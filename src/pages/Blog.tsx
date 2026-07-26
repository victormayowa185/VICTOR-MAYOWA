import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
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
const FALLBACK_IMAGES = ['/pic2.png', '/pic1.png', '/pic3.png', '/logo.png'];

const getRandomFallback = () =>
    FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];

const Hero: React.FC = () => {
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [bgImage, setBgImage] = useState<string>(getRandomFallback());
    const [loading, setLoading] = useState(true);

    const heroRef = useRef<HTMLDivElement>(null);
    const tagRef = useRef<HTMLSpanElement>(null);
    const headlineRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLAnchorElement>(null);
    const hasPlayedEntrance = useRef(false);

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

    // ---------- Hero content entrance, gated on Preloader ----------
    // ---------- Hide everything BEFORE first paint — prevents the flash ----------
    useLayoutEffect(() => {
        gsap.set(heroRef.current, { opacity: 0, scale: 1.04 });
        gsap.set([tagRef.current, headlineRef.current, descRef.current, ctaRef.current], {
            opacity: 0,
            y: 24,
        });
    }, []);

    // ---------- Hero content entrance, gated on Preloader ----------
    useEffect(() => {
        const playEntrance = () => {
            if (hasPlayedEntrance.current) return;
            hasPlayedEntrance.current = true;

            const tl = gsap.timeline({ delay: 0.15 });
            tl.to(heroRef.current, { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' })
                .to(tagRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.6')
                .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.35')
                .to(descRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
                .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.35');
        };

        if ((window as any).__preloaderFinished) {
            playEntrance();
        } else {
            window.addEventListener('preloader-finished', playEntrance);
        }

        return () => window.removeEventListener('preloader-finished', playEntrance);
    }, []);

    // ---------- Crossfade whenever bgImage swaps (fallback → real article image) ----------
    useEffect(() => {
        if (!heroRef.current || !hasPlayedEntrance.current) return;

        gsap.fromTo(
            heroRef.current,
            { '--bg-opacity': 0 } as any,
            {
                '--bg-opacity': 1,
                duration: 0.6,
                ease: 'power2.out',
            } as any
        );
    }, [bgImage]);

    return (
        <div>
            <h1 className="visually-hidden">Victor Mayowa – Web Developer & Designer Blog</h1>

            <div
                className="news-hero"
                ref={heroRef}
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-label="Latest trending tech news"
            >
                <div className="news-hero-overlay" />
                <div className="news-hero-content">
                    <span className="news-hero-tag" ref={tagRef}>
                        {loading ? 'Loading latest tech news…' : 'Trending in Tech'}
                    </span>

                    <h2 className="news-hero-headline" ref={headlineRef}>
                        {article ? article.title : 'Stay tuned for the latest in tech'}
                    </h2>

                    {article?.description && (
                        <p className="news-hero-desc" ref={descRef}>{article.description}</p>
                    )}

                    {article?.url && (
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-hero-cta"
                            ref={ctaRef}
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