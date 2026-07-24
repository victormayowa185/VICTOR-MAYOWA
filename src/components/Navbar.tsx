// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      {/* Inner container – the pill */}
      <div className="navbar-inner">
        {/* Logo / Brand */}
        <div className="navbar-brand">
          <div className="brand-logo-wrapper">
            <img src="/logo.png" alt="MAYO X Logo" className="brand-logo-img" />
          </div>
        </div>

        {/* Hamburger (visible only on mobile) */}
        <button className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Navigation links */}
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <li><NavLink to="/" end onClick={closeMenu}>Home</NavLink></li>
          <li><NavLink to="/about" onClick={closeMenu}>About</NavLink></li>
          <li><NavLink to="/projects" onClick={closeMenu}>Projects</NavLink></li>
          <li><NavLink to="/contact" onClick={closeMenu}>Contact</NavLink></li>
          <li className="blog-nav-item">
            <NavLink to="/blog" className="blog-link" onClick={closeMenu}>Blog</NavLink>
          </li>
        </ul>

        {/* Desktop Blog link (outside the mobile menu) */}
        <div className="blog-nav-wrapper">
          <NavLink to="/blog" className="blog-link" onClick={closeMenu}>Blog</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;