import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; 
import '../styles/Footer.css';
import { ReactComponent as HypnosLogo } from '../assets/hypnos_logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';


export default function Header() {

  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);



  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Determine scroll direction
          if (currentScrollY < lastScrollY || currentScrollY <= 0) {
            // Scrolling up or at top
            setIsFooterVisible(true);
          } else if (currentScrollY > lastScrollY) {
            // Scrolling down
            setIsFooterVisible(false);
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
    <footer className={`footer ${isFooterVisible ? 'visible' : 'hidden'}`}>
        
        <div className="footer-container">
        <NavLink to="/" onClick={() => window.scrollTo(0, 0)} className="logo-link">
        <HypnosLogo className="logo-hypnos" />
        </NavLink>
        </div>
        <div className="footer-links">
        <a href="https://www.instagram.com/filmimalmo" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
          <FontAwesomeIcon icon={faInstagram} className="footer-icon" />
        </a>
        <a href="https://www.facebook.com/filmimalmo" target="_blank" rel="noopener noreferrer" className="footer-icon-link">
          <FontAwesomeIcon icon={faFacebook} className="footer-icon" />
        </a>   
        </div>
        <div className="footer-address">
          <p>Norra Grängesbergsgatan 15, Malmö</p>
        </div>
  
    </footer>
  );
}