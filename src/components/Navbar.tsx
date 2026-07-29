// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navInnerRef = useRef<HTMLDivElement>(null);
  const isHiddenRef = useRef(false);
  const hasPlayedEntrance = useRef(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);


  useEffect(() => {
  if (menuOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    const handleVisibility = (e: Event) => {
      const { hidden } = (e as CustomEvent).detail;
      if (hidden === isHiddenRef.current) return;
      isHiddenRef.current = hidden;

      gsap.to(navRef.current, {
        y: hidden ? '-130%' : '0%',
        opacity: hidden ? 0 : 1,
        duration: 0.35,
        ease: 'power2.out',
      });
    };

    window.addEventListener('navbar-visibility', handleVisibility);
    return () => window.removeEventListener('navbar-visibility', handleVisibility);
  }, []);

  // ---------- Drop-from-top entrance, plays once, gated on Preloader finishing ----------
  useEffect(() => {
    const playEntrance = () => {
      if (hasPlayedEntrance.current || !navInnerRef.current) return;
      hasPlayedEntrance.current = true;

      gsap.fromTo(
        navInnerRef.current,
        { y: '-120%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.1, // tiny beat after content is visible, before the navbar drops in
        }
      );
    };

    // Start off-screen above immediately so there's no flash of the pill before animating
    if (navInnerRef.current) {
      gsap.set(navInnerRef.current, { y: '-120%', opacity: 0 });
    }

    // If the preloader already finished before Navbar mounted, play right away.
    if ((window as any).__preloaderFinished) {
      playEntrance();
    } else {
      window.addEventListener('preloader-finished', playEntrance);
    }

    return () => window.removeEventListener('preloader-finished', playEntrance);
  }, []);

  return (
    <>
      <nav className="navbar" ref={navRef}>
        <div className="navbar-inner" ref={navInnerRef}>
          <div className="navbar-brand">
            <div className="brand-logo-wrapper">
              <img src="/logo.png" alt="MAYO X Logo" className="brand-logo-img" />
            </div>
          </div>

          <button className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>

          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
            <li><NavLink to="/projects" onClick={closeMenu}>Projects</NavLink></li>
            <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
            <li className="blog-nav-item">
              <NavLink to="/blog" className="blog-link" onClick={closeMenu}>Blog</NavLink>
            </li>
          </ul>

          <div className="blog-nav-wrapper">
            <NavLink to="/blog" className="blog-link" onClick={closeMenu}>Blog</NavLink>
          </div>
        </div>
      </nav>
      {menuOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </>
  );
};

export default Navbar;