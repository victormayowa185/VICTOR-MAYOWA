import React, { useContext } from 'react';
import { TbHexagonLetterMFilled } from "react-icons/tb";
import { useTheme } from '../context/ThemeContext.tsx'; // adjust path
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <TbHexagonLetterMFilled className='logo-icon' />
        <span className="brand-name">VM</span>
      </div>

      <ul className="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>

      {/* Dark mode toggle button */}
      <button onClick={toggleDarkMode} className="theme-toggle">
       {isDarkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  );
};

export default Navbar;