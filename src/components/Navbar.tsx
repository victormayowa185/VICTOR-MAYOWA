import { TbHexagonLetterMFilled } from "react-icons/tb";
import { NavLink } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';  // Import icons
import { useState } from 'react';               // Import useState
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false); // State for hamburger menu

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);      // Close after clicking a link

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <TbHexagonLetterMFilled className='logo-icon' />
        <span className="brand-name">VM</span>
      </div>

      {/* Hamburger icon - visible only on mobile */}
      <button className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Navigation links - conditionally shown based on menuOpen on mobile */}
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