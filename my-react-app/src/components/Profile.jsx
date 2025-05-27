// src/components/profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUser, getUserIdFromToken, getUserById } from "@/api";
import { useUpdateProfile } from "@/store/useUpdateProfile";
import ProfileContainer from "./ProfileContainer";
import ProfileForm from "./ProfileForm";
import ProfileDialog from "./ProfileDialog";

// Helper function to map age to ageGroup
const mapAgeToAgeGroup = (age) => {
  if (!age) return "18-25";
  if (age >= 18 && age <= 25) return "18-25";
  if (age >= 26 && age <= 35) return "26-35";
  if (age >= 36 && age <= 45) return "36-45";
  return "46+";
};

export default function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = token ? getUserIdFromToken(token) : null;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [openModal, setOpenModal] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
  });

  const {
    gender,
    ageGroup,
    height,
    weight,
    goal,
    setGender,
    setAgeGroup,
    setHeight,
    setWeight,
    setGoal,
  } = useUpdateProfile();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId && token) {
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
          setGoal(userData.goal || "Lose Weight");
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setSubmitStatus({
        success: false,
        message: "User not authenticated.",
      });
      setOpenModal(true);
      return;
    }

    if (formData.password && formData.password.length < 8) {
      setSubmitStatus({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
      setOpenModal(true);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setSubmitStatus({
        success: false,
        message: "Passwords do not match.",
      });
      setOpenModal(true);
      return;
    }

    if (!gender || !ageGroup || !goal) {
      setSubmitStatus({
        success: false,
        message: "Please select a gender, age group, and goal.",
      });
      setOpenModal(true);
      return;
    }

    // Fetch current user data to fill in missing fields
    let currentUser;
    try {
      currentUser = await getUserById(Number(userId), token);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Failed to fetch user data.",
      });
      setOpenModal(true);
      return;
    }

    const requestBody = {
      email: formData.email || currentUser.email,
      password: formData.password || undefined, // Optional for updates
      fullName: `${formData.firstName || currentUser.first_name} ${formData.lastName || currentUser.last_name}`,
      selectedAgeGroup: ageGroup.split("-")[0], // e.g., "26-35" -> "26"
      selectedGender: gender, // Already "Male", "Female", etc.
      selectedHeight: height !== 0 ? height : currentUser.height,
      selectedWeight: weight !== 0 ? weight : currentUser.weight,
      selectedGoal: goal, // Already "Lose Weight", "Maintain", etc.
    };

    try {
      await updateUser(Number(userId), requestBody, token);

      // Update localStorage
      const updatedUser = {
        displayName: formData.firstName,
        email: formData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Re-fetch user data to update UI
      const updatedUserData = await getUserById(Number(userId), token);
      setFormData({
        firstName: updatedUserData.first_name || "",
        lastName: updatedUserData.last_name || "",
        email: updatedUserData.email || "",
        password: "",
        confirmPassword: "",
      });
      setGender(updatedUserData.gender || "Male");
      setAgeGroup(mapAgeToAgeGroup(updatedUserData.age));
      setHeight(updatedUserData.height || 0);
      setWeight(updatedUserData.weight || 0);
      setGoal(updatedUserData.goal || "Lose Weight");

      setSubmitStatus({
        success: true,
        message: "Profile updated successfully!",
      });
      setOpenModal(true);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: error.message || "Failed to update profile. Please try again.",
      });
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    if (submitStatus.success) {
      navigate("/user-home");
    }
  };

  return (
    <ProfileContainer>
      <ProfileForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
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
      />
      <ProfileDialog
        open={openModal}
        onClose={handleCloseModal}
        success={submitStatus.success}
        message={submitStatus.message}
      />
    </ProfileContainer>
  );
}