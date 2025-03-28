import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const MobileFooter = () => {
  // Add effect to ensure main content has proper padding
  useEffect(() => {
    // Add padding to the bottom of the main content
    const updateContentPadding = () => {
      const footerHeight = document.querySelector('.mobile-footer')?.offsetHeight || 70; // Default to 70px if not yet rendered
      
      // Add padding to exercises container if it exists
      const exercisesContainer = document.querySelector('.exercises-container');
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = `${footerHeight + 20}px`; // 20px extra for spacing
      }
    };

    // Call immediately and on resize for responsive support
    updateContentPadding();
    window.addEventListener('resize', updateContentPadding);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', updateContentPadding);
      
      // Reset padding when component unmounts
      const exercisesContainer = document.querySelector('.exercises-container');
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = '';
      }
    };
  }, []);

  return (
    <div className="mobile-footer">
      <Link to="/" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
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
      <Link to="/exercises" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="11" width="12" height="2" rx="1"></rect>
          <path d="M8 11V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <path d="M8 13v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2"></path>
        </svg>
        <span>Exercises</span>
      </Link>
      <Link to="/workout" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Workout</span>
      </Link>
      <Link to="/nutrition" className="footer-item">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
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