import { create } from "zustand";

export const useUpdateProfile = create((set) => ({
  gender: null,       // null instead of "male"
  ageGroup: null,     // null instead of "18-25"
  height: null,       // null instead of 0
  weight: null,       // null instead of 0
  goal: null,         // null instead of "WEIGHT_LOSS"

  setGender: (gender) => {
    set({ gender });
  },
  setAgeGroup: (ageGroup) => {
    set({ ageGroup });
  },
  setHeight: (height) => {
    set({ height });
  },
  setWeight: (weight) => {
    set({ weight });
  },
  setGoal: (goal) => {
    set({ goal });
  },
}));
