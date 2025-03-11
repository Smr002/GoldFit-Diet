import React, { useEffect } from "react";
import landingLogo from "../assets/landing-logo.png";

const Landing = () => {
  useEffect(() => {
    // Add Google Fonts link for Poppins
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Left Side Content */}
      <div className="text-content">
        <h1>Achieve Your Fitness Goals with Ease</h1>
        <p>
          Transform your body and mind with our expert-designed workout and nutrition plans.
          Start your journey to a healthier, stronger you today and see results that last.
        </p>
        <div className="buttons">
          <button className="get-started">Get Started</button>
          <button className="sign-in">Sign In</button>
        </div>
      </div>
      
      {/* Right Side Image */}
      <div className="image-container">
        <img
          src={landingLogo}
          alt="Fitness Illustration"
        />
      </div>
    </div>
  );
};

export default Landing;