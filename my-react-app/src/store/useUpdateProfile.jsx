import { create } from "zustand";

export const useUpdateProfile = create((set) => ({
  gender: null,       // null instead of "male"
  ageGroup: null,     // null instead of "18-25"
  height: null,       // null instead of 0
  weight: null,       // null instead of 0
  goal: null,         // null instead of "WEIGHT_LOSS"

  setGender: (gender) => {
    // console.log("Setting gender:", gender);
    set({ gender });
  },
  setAgeGroup: (ageGroup) => {
    // console.log("Setting ageGroup:", ageGroup);
    set({ ageGroup });
  },
  setHeight: (height) => {
    // console.log("Setting height:", height);
    set({ height });
  },
  setWeight: (weight) => {
    // console.log("Setting weight:", weight);
    set({ weight });
  },
  setGoal: (goal) => {
    // console.log("Setting goal:", goal);
    set({ goal });
  },
}));
