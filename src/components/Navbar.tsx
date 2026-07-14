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
      <div className="navbar-brand">
        {/* 👇 Replace this span with logo + text */}
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
        <li><NavLink to="/blog" onClick={closeMenu}>Blog</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;