import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfilePopup from "./ProfilePopup";
import { getUserIdFromToken, getUserById } from "../api";
import { Person } from "@mui/icons-material";

// Import the icon assets
import fitnessIcon from "../assets/fitness.png";
import reportIcon from "../assets/report.png";
import nutritionIcon from "../assets/nutrition.png";

const MobileFooter = () => {
  // State for profile popup
  const [profileOpen, setProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // User data states
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [goal, setGoal] = useState("");

  // Get user data and theme
  const token = localStorage.getItem("token");
  const userId = token ? getUserIdFromToken(token) : null;
  const darkMode = localStorage.getItem("theme") === "dark";

  // Helper function to map age to ageGroup
  const mapAgeToAgeGroup = (age) => {
    if (!age) return "18-25";
    if (age >= 18 && age <= 25) return "18-25";
    if (age >= 26 && age <= 35) return "26-35";
    if (age >= 36 && age <= 45) return "36-45";
    return "46+";
  };

  // Fetch user data when popup opens
  useEffect(() => {
    if (profileOpen && userId && token) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserById(Number(userId), token);
          setFormData({
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            email: userData.email || "",
            password: "",
            confirmPassword: "",
          });
          setGender(userData.gender || "Male");
          setAgeGroup(mapAgeToAgeGroup(userData.age));
          setHeight(userData.height || 0);
          setWeight(userData.weight || 0);
          setGoal(userData.goal || "WEIGHT_LOSS");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [profileOpen, userId, token]);

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Import handleSubmit logic from Profile.jsx
    // This would be the same logic that's in your Profile component
    // ...

    // Close the popup after successful update
    setProfileOpen(false);
  };

  // Add effect to ensure main content has proper padding
  useEffect(() => {
    // Add padding to the bottom of the main content
    const updateContentPadding = () => {
      const footerHeight =
        document.querySelector(".mobile-footer")?.offsetHeight || 70;

      const exercisesContainer = document.querySelector(".exercises-container");
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = `${footerHeight + 20}px`;
      }
    };

    updateContentPadding();
    window.addEventListener("resize", updateContentPadding);

    return () => {
      window.removeEventListener("resize", updateContentPadding);

      const exercisesContainer = document.querySelector(".exercises-container");
      if (exercisesContainer) {
        exercisesContainer.style.paddingBottom = "";
      }
    };
  }, []);

  // Define a common style for the icons
  const iconStyle = {
    width: "24px",
    height: "24px",
    filter: darkMode ? "brightness(0) invert(1)" : "none", // Make icons white in dark mode
    opacity: 0.9,
  };

  return (
    <>
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

        {/* Updated workouts icon to use report.png */}
        <Link to="/workouts" className="footer-item">
          <img src={reportIcon} alt="Workouts" style={iconStyle} />
          <span>Workouts</span>
        </Link>

        {/* Updated exercises icon to use fitness.png */}
        <Link to="/exercises" className="footer-item">
          <img src={fitnessIcon} alt="Exercises" style={iconStyle} />
          <span>Exercises</span>
        </Link>

        {/* Updated nutrition icon to use nutrition.png */}
        <Link to="/nutrition" className="footer-item">
          <img src={nutritionIcon} alt="Nutrition" style={iconStyle} />
          <span>Nutrition</span>
        </Link>

        {/* Profile button remains unchanged */}
        <button
          onClick={() => setProfileOpen(true)}
          className="footer-item"
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            width="24"
            height="24"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Profile</span>
        </button>
      </div>

      {/* Profile popup */}
      <ProfilePopup
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleProfileSubmit}
        gender={gender}
        setGender={setGender}
        ageGroup={ageGroup}
        setAgeGroup={setAgeGroup}
        height={height}
        setHeight={setHeight}
        weight={weight}
        setWeight={setWeight}
        goal={goal}
        setGoal={setGoal}
        darkMode={darkMode}
      />
    </>
  );
};

export default MobileFooter;
