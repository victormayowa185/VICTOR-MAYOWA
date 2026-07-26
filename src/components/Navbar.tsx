// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const isHiddenRef = useRef(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

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

  return (
    <nav className="navbar" ref={navRef}>
      <div className="navbar-inner">
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
      {menuOpen && <div className="menu-overlay" onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;