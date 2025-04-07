import React, { useState, useEffect } from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";

// eslint-disable-next-line no-unused-vars
export default function SecondNavbar({ setModalOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

        <div className="mobile-menu-container">
          <button
            className={`hamburger-menu ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link
            to="/exercises"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Exercises
          </Link>
          <Link
            to="/workouts"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Workouts
          </Link>
          <Link
            to="/nutrition"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Nutrition
          </Link>
          <Link
            to="/user-home"
            className="try-now-button"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}