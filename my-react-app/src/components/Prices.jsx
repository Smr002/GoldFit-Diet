import React, { useState, useEffect } from "react";

const Prices = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  
  useEffect(() => {
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
  
  const togglePlan = (plan) => {
    setSelectedPlan(plan);
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
          { text: "Premium app features", included: false }
        ],
        popular: false,
        cta: "Get Started",
        color: "#6c63ff"
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
          { text: "Premium app features", included: true }
        ],
        popular: true,
        cta: "Join Now",
        color: "#4834d4"
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
          { text: "Premium app features", included: true }
        ],
        popular: false,
        cta: "Go Premium",
        color: "#6c63ff"
      }
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
          { text: "Premium app features", included: false }
        ],
        popular: false,
        cta: "Get Started",
        color: "#6c63ff",
        savings: "Save $60"
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
          { text: "Premium app features", included: true }
        ],
        popular: true,
        cta: "Join Now",
        color: "#4834d4",
        savings: "Save $100"
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
          { text: "Premium app features", included: true }
        ],
        popular: false,
        cta: "Go Premium",
        color: "#6c63ff",
        savings: "Save $160"
      }
    ]
  };
  
  return (
    <section id="prices" className="section">
      <div id="prices-section" className={`prices-content section-content fade-in ${isVisible ? "visible" : ""}`}>
        <h2>Membership Plans</h2>
        <div className="section-divider"></div>
        <p className="prices-description">
          Choose the perfect membership plan to achieve your fitness goals. 
          Sign up today and start your journey to a healthier lifestyle.
        </p>
        
        <div className="pricing-toggle">
          <button 
            className={`toggle-btn ${selectedPlan === "monthly" ? "active" : ""}`}
            onClick={() => togglePlan("monthly")}
          >
            Monthly
          </button>
          <button 
            className={`toggle-btn ${selectedPlan === "annual" ? "active" : ""}`}
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
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              <div className="pricing-header">
                <h3>{plan.title}</h3>
                <div className="pricing-amount">
                  <span className="currency">{plan.currency}</span>
                  <span className="price">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                {plan.savings && <div className="annual-savings">{plan.savings}</div>}
              </div>
              <div className="pricing-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={feature.included ? "included" : "excluded"}>
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
                  style={{ background: `linear-gradient(to right, ${plan.color}, ${plan.popular ? "#4834d4" : "#6c63ff"})` }}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pricing-note">
          <p>All plans include a 7-day free trial. Cancel anytime during trial period.</p>
          <p>Need a custom plan? <a href="#contact">Contact us</a></p>
        </div>
      </div>
    </section>
  );
};

export default Prices;