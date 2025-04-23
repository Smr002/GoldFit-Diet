import { useEffect, useState } from "react";

const OurVision = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("our-vision");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setIsVisible(true);
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="our-vision" className={`vision-container ${isVisible ? "visible" : ""}`}>
      <div className="vision-content">
        <h2>Our Vision</h2>
        <div className="vision-divider"></div>
        <p>
          At our fitness center, we believe in pushing limits and achieving the
          impossible. Our mission is to empower individuals to transform their
          lives through strength, endurance, and discipline. Join us in building
          a healthier, stronger future.
        </p>
        <div className="vision-features">
          <div className="feature">
            <div className="feature-icon">💪</div>
            <div className="feature-text">Strength</div>
          </div>
          <div className="feature">
            <div className="feature-icon">⏱️</div>
            <div className="feature-text">Endurance</div>
          </div>
          <div className="feature">
            <div className="feature-icon">🧠</div>
            <div className="feature-text">Discipline</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurVision;