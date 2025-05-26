import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Prices = ({ setModalOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }

    const handleScroll = () => {
      const section = document.getElementById("prices-section");
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);

    if (newDarkModeState) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }

    setIsMenuOpen(false);
  };

  const togglePlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Function to handle CTA button clicks - opens the modal
  const handleCTAClick = (plan) => {
    if (typeof setModalOpen === "function") {
      // Pass the selected plan and period to the modal
      setModalOpen({
        open: true,
        plan: plan,
        period: selectedPlan,
      });
    } else {
      console.error("setModalOpen is not a function");
    }
  };

  const plans = {
    monthly: [
      {
        id: 1,
        title: "Basic",
        price: 29.99,
        currency: "$",
        period: "month",
        features: [
          { text: "Access to gym facilities", included: true },
          { text: "2 group classes per week", included: true },
          { text: "Basic fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "Personal training sessions", included: false },
          { text: "Nutrition consultation", included: false },
          { text: "Premium app features", included: false },
        ],
        popular: false,
        cta: "Get Started",
        color: "var(--primary-color)",
      },
      {
        id: 2,
        title: "Standard",
        price: 49.99,
        currency: "$",
        period: "month",
        features: [
          { text: "Access to gym facilities", included: true },
          { text: "Unlimited group classes", included: true },
          { text: "Comprehensive fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "2 personal training sessions", included: true },
          { text: "Nutrition consultation", included: false },
          { text: "Premium app features", included: true },
        ],
        popular: true,
        cta: "Join Now",
        color: "var(--secondary-color)",
      },
      {
        id: 3,
        title: "Premium",
        price: 79.99,
        currency: "$",
        period: "month",
        features: [
          { text: "24/7 access to gym facilities", included: true },
          { text: "Unlimited group classes", included: true },
          { text: "Advanced fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "4 personal training sessions", included: true },
          { text: "Monthly nutrition consultation", included: true },
          { text: "Premium app features", included: true },
        ],
        popular: false,
        cta: "Go Premium",
        color: "var(--primary-color)",
      },
    ],
    annual: [
      {
        id: 1,
        title: "Basic",
        price: 299.99,
        currency: "$",
        period: "year",
        features: [
          { text: "Access to gym facilities", included: true },
          { text: "2 group classes per week", included: true },
          { text: "Basic fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "Personal training sessions", included: false },
          { text: "Nutrition consultation", included: false },
          { text: "Premium app features", included: false },
        ],
        popular: false,
        cta: "Get Started",
        color: "var(--primary-color)",
        savings: "Save $60",
      },
      {
        id: 2,
        title: "Standard",
        price: 499.99,
        currency: "$",
        period: "year",
        features: [
          { text: "Access to gym facilities", included: true },
          { text: "Unlimited group classes", included: true },
          { text: "Comprehensive fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "2 personal training sessions", included: true },
          { text: "Nutrition consultation", included: false },
          { text: "Premium app features", included: true },
        ],
        popular: true,
        cta: "Join Now",
        color: "var(--secondary-color)",
        savings: "Save $100",
      },
      {
        id: 3,
        title: "Premium",
        price: 799.99,
        currency: "$",
        period: "year",
        features: [
          { text: "24/7 access to gym facilities", included: true },
          { text: "Unlimited group classes", included: true },
          { text: "Advanced fitness assessment", included: true },
          { text: "Online workout library", included: true },
          { text: "4 personal training sessions", included: true },
          { text: "Monthly nutrition consultation", included: true },
          { text: "Premium app features", included: true },
        ],
        popular: false,
        cta: "Go Premium",
        color: "var(--primary-color)",
        savings: "Save $160",
      },
    ],
  };

  return (
    <section id="prices" className="section">
      <div
        id="prices-section"
        className={`prices-content section-content fade-in ${
          isVisible ? "visible" : ""
        }`}
      >
        <h2 className="section-title">Membership Plans</h2>
        <div className="section-divider"></div>
        <p className="prices-description">
          Choose the perfect membership plan to achieve your fitness goals. Sign
          up today and start your journey to a healthier lifestyle.
        </p>

        <div className="pricing-toggle">
          <button
            className={`toggle-btn ${
              selectedPlan === "monthly" ? "active" : ""
            }`}
            onClick={() => togglePlan("monthly")}
          >
            Monthly
          </button>
          <button
            className={`toggle-btn ${
              selectedPlan === "annual" ? "active" : ""
            }`}
            onClick={() => togglePlan("annual")}
          >
            Annual
          </button>
        </div>

        <div className="pricing-cards">
          {plans[selectedPlan].map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.popular ? "popular" : ""}`}
              style={plan.popular ? { borderColor: plan.color } : {}}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              <div className="pricing-header">
                <h3>{plan.title}</h3>
                <div className="pricing-amount">
                  <span className="currency">{plan.currency}</span>
                  <span className="price">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="annual-savings">{plan.savings}</div>
                )}
              </div>
              <div className="pricing-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className={feature.included ? "included" : "excluded"}
                    >
                      <span className="feature-icon">
                        {feature.included ? "✓" : "×"}
                      </span>
                      <span className="feature-text">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pricing-footer">
                <button
                  className="pricing-cta"
                  style={{
                    background: `linear-gradient(to right, ${plan.color}, ${
                      plan.popular
                        ? "var(--secondary-color)"
                        : "var(--primary-color)"
                    })`,
                  }}
                  onClick={() => handleCTAClick(plan)}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>
            All plans include a 7-day free trial. Cancel anytime during trial
            period.
          </p>
          <p>
            Need a custom plan?{" "}
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=goldfitservice7@gmail.com&su=Hello&body=Hi%20GoldFit%20Team,">
              Contact us
            </a>
          </p>
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        {isMenuOpen && (
          <div className="theme-options">
            <button className="theme-option" onClick={toggleDarkMode}>
              <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
            </button>
          </div>
        )}
        <button className="theme-toggle-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </button>
      </div>
    </section>
  );
};

export default Prices;
