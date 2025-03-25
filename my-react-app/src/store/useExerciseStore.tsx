import { create } from "zustand";

export const useExerciseStore = create((set) => ({
  selectedCategory: null,
  selectedDifficulty: null,
  selectedEquipment: null,
  selectedMuscleGroup: null,
  selectedExercise: null,
  exerciseDuration: 30, // Default duration in minutes
  
  setCategory: (category) => set({ selectedCategory: category }),
  setDifficulty: (difficulty) => set({ selectedDifficulty: difficulty }),
  setEquipment: (equipment) => set({ selectedEquipment: equipment }),
  setMuscleGroup: (muscleGroup) => set({ selectedMuscleGroup: muscleGroup }),
  setExercise: (exercise) => set({ selectedExercise: exercise }),
  setExerciseDuration: (duration) => set({ exerciseDuration: duration }),

  reset: () =>
    set({
      selectedCategory: null,
      selectedDifficulty: null,
      selectedEquipment: null,
      selectedMuscleGroup: null,
      selectedExercise: null,
      exerciseDuration: 30,
    }),
}));
