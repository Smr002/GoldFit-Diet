import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const MobileFooter = () => {
  // Add effect to ensure main content has proper padding
  useEffect(() => {
    // Add padding to the bottom of the main content
    const updateContentPadding = () => {
      const footerHeight =
        document.querySelector(".mobile-footer")?.offsetHeight || 70; // Default to 70px if not yet rendered

      // Add padding to exercises container if it exists
      const exercisesContainer = document.querySelector(".exercises-container");
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = `${footerHeight + 20}px`; // 20px extra for spacing
      }
    };

    // Call immediately and on resize for responsive support
    updateContentPadding();
    window.addEventListener("resize", updateContentPadding);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", updateContentPadding);

      // Reset padding when component unmounts
      const exercisesContainer = document.querySelector(".exercises-container");
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = "";
      }
    };
  }, []);

  return (
    <div className="mobile-footer">
      <Link to="/user-home" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </Link>
      
      <Link to="/workouts" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 1 1 0 8h-1"></path>
          <path d="M6 8h-1a4 4 0 1 0 0 8h1"></path>
          <path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"></path>
        </svg>
        <span>Workouts</span>
      </Link>
      
      <Link to="/exercises" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 11H5m14 0a2 2 0 1 1 0 4H5a2 2 0 1 1 0-4m14 0V9a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"></path>
        </svg>
        <span>Exercises</span>
      </Link>
      
      <Link to="/nutrition" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="10" y1="1" x2="10" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
        <span>Nutrition</span>
      </Link>
      
      <Link to="/profile" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default MobileFooter;
