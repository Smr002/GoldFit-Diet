import React, { useState, useEffect } from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";

export default function Navbar({ setModalOpen }) {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`custom-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
        
        <nav className="nav-links">
          {["Our Vision", "Workouts", "Prices", "Contact Us"].map((item) => (
            <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} key={item} className="nav-link">
              {item}
            </a>
          ))}
          <button 
            onClick={() => setModalOpen(true)} 
            className="try-now-button"
          >
            Try Now
          </button>
        </nav>
      </div>
    </header>
  );
}