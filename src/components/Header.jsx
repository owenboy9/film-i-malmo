import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 
import '../styles/Header.css';
import { ReactComponent as FilmiMalmoLogo } from '../assets/logo_fim.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  // Dark mode toggle
  const [isDarkMode, setIsDarkMode] = useState(() => {
  // Check localStorage or default to false
  return localStorage.getItem('theme') === 'dark';
});

const toggleTheme = () => {
  setIsDarkMode((prev) => {
    const newMode = !prev;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    return newMode;
  });
};

  // Apply dark mode class to body
useEffect(() => {
  document.body.className = isDarkMode ? 'dark' : 'light';
}, [isDarkMode]);

  // Close menu on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Determine scroll direction
          if (currentScrollY < lastScrollY || currentScrollY <= 0) {
            // Scrolling up or at top
            setIsHeaderVisible(true);
          } else if (currentScrollY > lastScrollY) {
            // Scrolling down
            setIsHeaderVisible(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${isHeaderVisible ? 'visible' : 'hidden'}`}>
        

        <NavLink to="/" onClick={() => window.scrollTo(0, 0)}>
          <FilmiMalmoLogo className="logo" />     
        </NavLink>



      <button className="hamburger" onClick={toggleMenu} aria-expanded={isMenuOpen}
        aria-label="Toggle navigation menu">
        ☰
      </button>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
            <FontAwesomeIcon icon={faUser} className="header-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/Schedule" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/more" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            More
            </NavLink>
          </li>
          <li>
            <NavLink to="/TestDB" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            TestDB
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            Admin
            </NavLink>
          </li>
          <li>
          <span onClick={toggleTheme}>
            <FontAwesomeIcon
              icon={isDarkMode ? faMoon : faSun}
              className="dark-light-icon"
            />
          </span>
          </li>
        </ul>
      </nav>

      <nav className="nav-desktop">
        <ul>
          <li>
            <NavLink to="/" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
            <FontAwesomeIcon icon={faUser} className="header-icon" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/schedule" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              Schedule
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink to="/more" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              More
            </NavLink>
          </li>
          <li>
            <NavLink to="/TestDB" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              TestDB
            </NavLink>
          </li>
          <li>
          <span onClick={toggleTheme}>
            <FontAwesomeIcon
              icon={isDarkMode ? faMoon : faSun}
              className="dark-light-icon"
            />
          </span>
          </li>
        </ul>
      </nav>
    </header>
  );
}