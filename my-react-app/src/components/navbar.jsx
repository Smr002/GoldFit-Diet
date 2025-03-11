import React from "react";
import logo from "../assets/react.svg";
export default function Navbar() {
  
  return (
    <header className="custom-header">
      <a href="/">
        {" "}
        <img src={logo}></img>
      </a>

      <nav className="nav-links">
        {["Our Vision", "Workouts", "Prices", "About Us"].map((item) => (
          <a href="#" key={item} className="nav-link">
            {item}
          </a>
        ))}
        <button className="try-now-button">Try Now</button>
      </nav>
    </header>
  );
}
