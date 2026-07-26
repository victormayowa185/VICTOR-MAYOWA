import React, { useRef, useState, useEffect } from 'react';
import {
  FaReact,
  FaJsSquare,
  FaCss3Alt,
  FaGitAlt,
  FaGithub,
} from 'react-icons/fa';
import { SiTypescript, SiPython, SiNodedotjs } from 'react-icons/si';
import gsap from 'gsap';
import TypewriterText from '../components/TypewriterText';
import '../styles/home.css';

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const mobileFooterRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasPlayedEntrance = useRef(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x, y });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => hero.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // ---------- Premium entrance sequence, gated on Preloader finishing ----------
  useEffect(() => {
    const playEntrance = () => {
      if (hasPlayedEntrance.current) return;
      hasPlayedEntrance.current = true;

      const validBoxes = boxRefs.current.filter(Boolean);

      // Set initial hidden states up front, so nothing flashes before animating
      gsap.set([nameRef.current, taglineRef.current, bioRef.current, ctaRef.current, mobileFooterRef.current], {
        y: 24,
        opacity: 0,
      });
      gsap.set(validBoxes, { y: 30, opacity: 0, scale: 0.85 });
      gsap.set(badgeRef.current, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({ delay: 0.15 });

      tl.to(nameRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .to(taglineRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.45')
        .to(bioRef.current, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
        .to(ctaRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.35')
        .to(mobileFooterRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.3')
        .to(
          validBoxes,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.6)',
            stagger: 0.09,
          },
          '-=0.3'
        )
        .to(badgeRef.current, { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    };

    if ((window as any).__preloaderFinished) {
      playEntrance();
    } else {
      window.addEventListener('preloader-finished', playEntrance);
    }

    return () => window.removeEventListener('preloader-finished', playEntrance);
  }, []);

  const boxes = [
    {
      id: 1,
      icon: <FaReact size={120} />,
      label: 'React',
      color: '#61dafb',
      offset: 0.3,
      top: '-3%',
      left: '6%',
    },
    {
      id: 2,
      icon: <FaJsSquare size={48} />,
      label: 'JavaScript',
      color: '#f7df1e',
      offset: 0.5,
      top: '1%',
      right: '1%',
    },
    {
      id: 3,
      icon: <SiTypescript size={78} />,
      label: 'TypeScript',
      color: '#3178c6',
      offset: 0.4,
      bottom: '25%',
      left: '-6%',
    },
    {
      id: 4,
      icon: <FaGitAlt size={28} />,
      label: '20+ repos',
      color: '#f34f29',
      offset: 0.6,
      bottom: '1%',
      right: '-3%',
    },
    {
      id: 5,
      icon: <FaCss3Alt size={98} />,
      label: 'CSS3',
      color: '#2965f1',
      offset: 0.2,
      top: '60%',
      left: '35%',
    },
    {
      id: 6,
      icon: <FaGithub size={38} />,
      label: 'GitHub',
      color: '#181717',
      offset: 0.35,
      top: '20%',
      left: '45%',
    },
    {
      id: 7,
      icon: <SiPython size={48} />,
      label: 'Python',
      color: '#3776AB',
      offset: 0.45,
      bottom: '25%',
      right: '17%',
    },
    {
      id: 8,
      icon: <SiNodedotjs size={48} />,
      label: 'Node.js',
      color: '#339933',
      offset: 0.5,
      top: '30%',
      right: '-6%',
    },
  ];

  const badgeWords = ['Creative', 'Innovative', 'Passionate', 'Detail-Oriented'];

  return (
    <div ref={heroRef} className="hero-new">
      <div className="homepage-container">
        {/* Sidebar */}
        <div className="sidebar-rotate">
          <span className="sidebar-text">2026</span>
          <div className="sidebar-divider"></div>
          <span className="sidebar-text">Founder of MAYO X</span>
        </div>

        {/* Left column */}
        <div className="main-content">
          <h1 className="hero-name" ref={nameRef}>
            Code. Design.<br /> Build. Innovate.
          </h1>
          <p className="hero-tagline" ref={taglineRef}>
            I'm Victor Mayowa — a Software Developer &amp; Designer.
          </p>
          <p className="hero-bio" ref={bioRef}>
            I specialize in UI/UX Design, Responsive Web Design, and Visual Development.
            I build <b>digital products</b> that are fast, accessible, and beautifully designed —
            from responsive websites to cross-platform desktop apps.
          </p>
          <a href="/contact" className="hero-cta" ref={ctaRef}>Connect With Me</a>

          <div className="mobile-footer-type" ref={mobileFooterRef}>
            <TypewriterText words={badgeWords} />
          </div>
        </div>

        {/* Right column – scattered boxes */}
        <div className="hero-right">
          <div className="boxes-container">
            {boxes.map((box, index) => {
              const translateX = mousePos.x * 30 * box.offset;
              const translateY = mousePos.y * 30 * box.offset;

              const positionStyles: React.CSSProperties = {};
              if (box.top !== undefined) positionStyles.top = box.top;
              if (box.left !== undefined) positionStyles.left = box.left;
              if (box.right !== undefined) positionStyles.right = box.right;
              if (box.bottom !== undefined) positionStyles.bottom = box.bottom;

              return (
                <div
                  key={box.id}
                  ref={(el) => { boxRefs.current[index] = el; }}
                  className="scatter-box"
                  style={{
                    ...positionStyles,
                    borderColor: box.color,
                    '--mouse-x': `${translateX}px`,
                    '--mouse-y': `${translateY}px`,
                  } as React.CSSProperties}
                >
                  <div className="box-icon" style={{ color: box.color }}>
                    {box.icon}
                  </div>
                  <span className="box-label">{box.label}</span>
                </div>
              );
            })}

            {/* Central badge */}
            <div className="central-badge" ref={badgeRef}>
              <TypewriterText words={badgeWords} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;