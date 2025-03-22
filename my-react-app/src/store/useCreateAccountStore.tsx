import { create } from "zustand";

export const useCreateAccountStore = create((set) => ({
  selectedBodyType: null,
  selectedAgeGroup: null,
  selectedHeight: null,
  selectedWeight: null,
  selectedGoal: null,
  selectedBodyYouWant: null,
  selectedLoseWeight: null,
  selectedGainMuscle: null,
  selectedGetShredded: null,
  workoutFrequency: 3,
  
  setBodyType: (bodyType) => set({ selectedBodyType: bodyType }),
  setAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),
  setHeight: (height) => set({ selectedHeight: height }),
  setWeight: (weight) => set({ selectedWeight: weight }),
  setGoal: (goal) => set({ selectedGoal: goal }),
  setBodyYouWant: (bodyYouWant) => set({ selectedBodyYouWant: bodyYouWant }),
  setWorkoutFrequency: (frequency) => set({ workoutFrequency: frequency }),
  
  reset: () =>
    set({
      selectedBodyType: null,
      selectedAgeGroup: null,
      selectedHeight: null,
      selectedWeight: null,
      selectedGoal: null,
      selectedBodyYouWant: null,
      selectedLoseWeight: null,
      selectedGainMuscle: null,
      selectedGetShredded: null,
      workoutFrequency: 3,
    }),
}));