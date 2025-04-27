import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types for our store
type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
}

type Workout = {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  goal: string;
  exercises: Exercise[];
  src: string; 
  createdAt: string;
  userId: string;
}

type UserCreatedWorkoutState = {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addWorkout: (workout: Omit<Workout, "id" | "createdAt" | "userId">) => Promise<Workout>;
  updateWorkout: (workout: Workout) => Promise<Workout>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  fetchUserWorkouts: (userId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// Create the store with persistence
export const useUserCreatedWorkoutStore = create<UserCreatedWorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      loading: false,
      error: null,
      
      // Add a new workout
      addWorkout: async (workoutData) => {
        set({ loading: true, error: null });
        
        try {
          // Generate unique ID
          const id = `workout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          // Get user ID from token or localStorage
          const userId = localStorage.getItem("userId") || "unknown-user";
          
          // Create new workout object
          const newWorkout: Workout = {
            ...workoutData,
            id,
            createdAt: new Date().toISOString(),
            userId
          };
          
          // Update state with new workout
          set((state) => ({
            workouts: [...state.workouts, newWorkout],
            loading: false
          }));
          
          console.log("Workout created successfully:", newWorkout.name);
          return newWorkout;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to create workout";
          set({ error: errorMessage, loading: false });
          console.error("Error creating workout:", errorMessage);
          throw error;
        }
      },
      
      // Update an existing workout
      updateWorkout: async (updatedWorkout) => {
        set({ loading: true, error: null });
        
        try {
          set((state) => ({
            workouts: state.workouts.map((workout) => 
              workout.id === updatedWorkout.id ? updatedWorkout : workout
            ),
            loading: false
          }));
          
          console.log("Workout updated successfully:", updatedWorkout.name);
          return updatedWorkout;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to update workout";
          set({ error: errorMessage, loading: false });
          console.error("Error updating workout:", errorMessage);
          throw error;
        }
      },
      
      // Delete a workout
      deleteWorkout: async (workoutId) => {
        set({ loading: true, error: null });
        
        try {
          set((state) => ({
            workouts: state.workouts.filter((workout) => workout.id !== workoutId),
            loading: false
          }));
          
          console.log("Workout deleted successfully");
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to delete workout";
          set({ error: errorMessage, loading: false });
          console.error("Error deleting workout:", errorMessage);
          throw error;
        }
      },
      
      // Fetch user workouts
      fetchUserWorkouts: async (userId) => {
        set({ loading: true, error: null });
        
        try {
          // In a real app, this would be an API call
          // For now, we'll filter the existing workouts by userId
          const userWorkouts = get().workouts.filter(workout => workout.userId === userId);
          
          // We're not changing the workouts here, just demonstrating the pattern
          // In a real app, you would fetch from an API and set the state
          set({ loading: false });
          
          console.log(`Fetched ${userWorkouts.length} workouts for user ${userId}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Failed to fetch user workouts";
          set({ error: errorMessage, loading: false });
          console.error("Error fetching user workouts:", errorMessage);
        }
      },
      
      // Set loading state
      setLoading: (loading) => set({ loading }),
      
      // Set error state
      setError: (error) => set({ error }),
      
      // Reset store to initial state
      reset: () => set({ workouts: [], loading: false, error: null }),
    }),
    {
      name: "user-created-workouts",
      // Only persist workouts to avoid storing loading/error states
      partialize: (state) => ({ workouts: state.workouts }),
    }
  )
);