import React, { useRef, useState, useEffect } from 'react';
import {
  FaReact,
  FaJsSquare,
  FaCss3Alt,
  FaGitAlt,
} from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import '../styles/home.css';

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

  const boxes = [
    { id: 1, icon: <FaReact size={98} />, label: 'React', color: '#61dafb', offset: 0.3 },
    { id: 2, icon: <FaJsSquare size={48} />, label: 'JavaScript', color: '#f7df1e', offset: 0.5 },
    { id: 3, icon: <SiTypescript size={98} />, label: 'TypeScript', color: '#3178c6', offset: 0.4 },
    { id: 4, icon: <FaGitAlt size={28} />, label: '20+ repos', color: '#f34f29', offset: 0.6 },
    { id: 5, icon: <FaCss3Alt size={48} />, label: 'CSS3', color: '#2965f1', offset: 0.2 },
  ];

  return (
    <div ref={heroRef} className="hero-new">
      <div className="homepage-container">
        {/* Sidebar – using writing-mode */}
        <div className="sidebar-rotate">
          <span className="sidebar-text">2026</span>
          <div className="sidebar-divider"></div>
          <span className="sidebar-text">Founder of MAYO X  </span>
        </div>

        {/* Left column – text */}
        <div className="main-content">
          <h1 className="hero-name">
            Code. Design.<br /> Build. Innovate.
          </h1>
          <p className="hero-tagline">
            I'm Victor Mayowa — a Software Developer &amp; Designer.
          </p>
          <p className="hero-bio">
            I specialize in UI/UX Design, Responsive Web Design, and Visual Development.
            I build <b>digital products</b> that are fast, accessible, and beautifully designed —
            from responsive websites to cross-platform desktop apps.
          </p>
          <a href="/contact" className="hero-cta">Connect With Me</a>
        </div>

        {/* Right column – scattered boxes */}
        <div className="hero-right">
          <div className="boxes-container">
            {boxes.map((box) => {
              const translateX = mousePos.x * 30 * box.offset;
              const translateY = mousePos.y * 30 * box.offset;

              return (
                <div
                  key={box.id}
                  className="scatter-box"
                  style={{
                    transform: `translate(${translateX}px, ${translateY}px)`,
                    borderColor: box.color,
                  }}
                >
                  <div className="box-icon" style={{ color: box.color }}>
                    {box.icon}
                  </div>
                  <span className="box-label">{box.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;