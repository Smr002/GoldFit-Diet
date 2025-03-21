import { create } from "zustand";

export const useCreateAccountStore = create((set) => ({
  selectedBodyType: null,
  selectedAgeGroup: null,
  selectedGoal: null,
  selectedBodyYouWant: null,
  selectedLoseWeight: null,
  selectedGainMuscle: null,
  selectedGetShredded: null,

  setBodyType: (bodyType) => set({ selectedBodyType: bodyType }),
  setAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),
  setGoal: (goal) => set({ selectedGoal: goal }),

  reset: () =>
    set({
      selectedBodyType: null,
      selectedAgeGroup: null,
      selectedGoal: null,
      selectedBodyYouWant: null,
    }),
}));
