import React from "react";
import logo from "../assets/react.svg";
import { Link } from "react-router-dom";

export default function Navbar({ setModalOpen, isModalOpen }) {
  return (
    <>
      <header className="custom-header">
      <Link to="/">
  <img src={logo} alt="Logo" />
</Link>
        <nav className="nav-links">
          {["Our Vision", "Workouts", "Prices", "About Us"].map((item) => (
            <a href="#" key={item} className="nav-link">
              {item}
            </a>
          ))}
          <button onClick={() => setModalOpen(true)} className="try-now-button">
            "Try Now"
          </button>
        </nav>
      </header>
    </>
  );
}