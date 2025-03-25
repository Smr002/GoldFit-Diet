import { create } from "zustand";

export const useCreateAccountStore = create((set) => ({
  selectedGender: null,
  selectedBodyType: null,
  selectedAgeGroup: null,
  selectedHeight: null,
  selectedWeight: null,
  selectedGoal: null,
  selectedBodyYouWant: null,
  selectedLoseWeight: null,
  selectedGainMuscle: null,
  selectedGetShredded: null,
  selectedYourRealGoal: null,
  workoutFrequency: 3,

  setGender: (gender) => set({ selectedGender: gender }),
  setBodyType: (bodyType) => set({ selectedBodyType: bodyType }),
  setAgeGroup: (ageGroup) => set({ selectedAgeGroup: ageGroup }),
  setHeight: (height) => set({ selectedHeight: height }),
  setWeight: (weight) => set({ selectedWeight: weight }),
  setGoal: (goal) => set({ selectedGoal: goal }),
  setLoseWeight: (loseWeight) => set({ selectedLoseWeight: loseWeight }),
  setGainMuscle: (gainMuscle) => set({ selectedGainMuscle: gainMuscle }),
  setGetShredded: (getShredded) => set({ selectedGetShredded: getShredded }),
  setBodyYouWant: (bodyYouWant) => set({ selectedBodyYouWant: bodyYouWant }),
  setWorkoutFrequency: (frequency) => set({ workoutFrequency: frequency }),

  setYourRealGoal: (goal) => {
    if (goal === "loseWeight") {
      set({
        selectedLoseWeight: true,
        selectedGainMuscle: null,
        selectedGetShredded: null,
      });
    } else if (goal === "gainMuscle") {
      set({
        selectedLoseWeight: null,
        selectedGainMuscle: true,
        selectedGetShredded: null,
      });
    } else if (goal === "getShredded") {
      set({
        selectedLoseWeight: null,
        selectedGainMuscle: null,
        selectedGetShredded: true,
      });
    } else {
      set({
        selectedLoseWeight: null,
        selectedGainMuscle: null,
        selectedGetShredded: null,
      });
    }
  },

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
