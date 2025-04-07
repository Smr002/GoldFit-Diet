import React, { useState, useEffect } from "react";
import logo from "../assets/goldfitlogo.png";
import { Link } from "react-router-dom";

export default function Navbar({ setModalOpen }) {
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`custom-header ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </Link>

        <div className="mobile-menu-container">
          <button
            className={`hamburger-menu ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {["OurVision", "Workouts", "Prices", "ContactUs"].map((item) => (
            <a
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              key={item}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button onClick={() => setModalOpen(true)} className="try-now-button">
            TryNow
          </button>
        </nav>
      </div>
    </header>
  );
}
