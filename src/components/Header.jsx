import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'; 
import '../styles/Header.css';
import { ReactComponent as FilmiMalmoLogo } from '../assets/logo_fim.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSun, faMoon, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabase';


export default function Header({ setShowAuth }) {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const [isUserIconHovered, setIsUserIconHovered] = useState(false);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutPopup(false);
    window.location.reload();
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Optionally, subscribe to auth changes for live updates
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  return (
    <header className={`header ${isHeaderVisible ? 'visible' : 'hidden'}`}>
        
      <NavLink to="/" onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}>
        <FilmiMalmoLogo className="logo" />     
      </NavLink>

      <nav className="nav-user">
        <ul className="user-menu">
          <li>
          <span onClick={toggleTheme}>
            <FontAwesomeIcon
              icon={isDarkMode ? faMoon : faSun}
              className="dark-light-icon"
            />
          </span>
          </li>
          <li>
          <span className="user-icon"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
            onMouseEnter={() => setIsUserIconHovered(true)}
            onMouseLeave={() => setIsUserIconHovered(false)}
            onClick={() => {
              if (user) {
                setShowLogoutPopup(true);
              } else {
                setShowAuth(true);
              }
            }}
          >
            <FontAwesomeIcon icon={isUserIconHovered ? faArrowRightFromBracket : faUser} className="header-icon" />
          </span>
          </li>
          <li>
            <NavLink
              to="/account-settings"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              {user ? 'My Membership' : 'Login'}
            </NavLink>
          </li>
        </ul>
        </nav>

      <span className="hamburger" onClick={toggleMenu} aria-expanded={isMenuOpen}
        aria-label="Toggle navigation menu">
        ☰
      </span>

      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink to="/calendar" onClick={() => {toggleMenu(); window.scrollTo(0, 0);}} className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}            >
            Calendar
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
        </ul>
      </nav>

      <nav className="nav-desktop">
        <ul>
          <li>
            <NavLink
              to="/calendar"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/more"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              More
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/TestDB"
              onClick={() => { setShowAuth(false); window.scrollTo(0, 0); }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              TestDB
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin" onClick={() => {window.scrollTo(0, 0);}}className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}>
              Admin
            </NavLink>
          </li>
        </ul>
      </nav>

      {showLogoutPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="popup popup-logout">
            <p>Do you want to log out?</p>
            <button onClick={handleLogout} style={{ marginRight: 12 }}>Yes</button>
            <button onClick={() => setShowLogoutPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </header>
  );
}