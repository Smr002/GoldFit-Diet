import { create } from "zustand"

// Define types for our store
type Exercise = {
  id: string
  name: string
  sets: number
  reps: number | string
  rest: number
  weight?: number
}

type Workout = {
  id: string
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  duration: number
  goal: string
  exercises: Exercise[]
  imageUrl: string
  createdAt: string
  isRecommended: boolean
}

type WorkoutLog = {
  id: string
  workoutId: string
  date: string
  duration: number
  notes?: string
  exercises: (Exercise & { weight?: number; completed?: boolean })[]
}

type WorkoutsState = {
  workouts: Workout[]
  recommendedWorkouts: Workout[]
  userWorkouts: Workout[]
  favorites: string[]
  workoutLogs: WorkoutLog[]
  notificationSettings: Record<string, boolean>
  loading: boolean
  activeTab: "all" | "recommended" | "my-workouts" | "favorites"
  searchTerm: string
  filterOptions: {
    difficulty: "all" | "beginner" | "intermediate" | "advanced"
    duration: "all" | "short" | "medium" | "long"
    goal: string
  }

  // Actions
  fetchWorkouts: () => Promise<void>
  createWorkout: (workout: Omit<Workout, "id" | "createdAt" | "isRecommended">) => void
  updateWorkout: (workout: Workout) => void
  deleteWorkout: (workoutId: string) => void
  logWorkout: (workoutLog: Omit<WorkoutLog, "id" | "date">) => void
  toggleFavorite: (workoutId: string) => void
  toggleNotification: (workoutId: string) => void
  setActiveTab: (tab: "all" | "recommended" | "my-workouts" | "favorites") => void
  setSearchTerm: (term: string) => void
  setFilterOption: (option: string, value: string) => void
  getWorkoutLogs: (workoutId: string) => WorkoutLog[]
  reset: () => void
}

// Create the store
export const useWorkoutsStore = create<WorkoutsState>((set, get) => ({
  workouts: [],
  recommendedWorkouts: [],
  userWorkouts: [],
  favorites: [],
  workoutLogs: [],
  notificationSettings: {},
  loading: false,
  activeTab: "all",
  searchTerm: "",
  filterOptions: {
    difficulty: "all",
    duration: "all",
    goal: "all",
  },

  // Fetch workouts from API or local storage
  fetchWorkouts: async () => {
    set({ loading: true })
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      const mockRecommendedWorkouts = [
        {
          id: "rec-1",
          title: "Full Body Strength",
          description: "A complete full body workout focusing on strength and muscle building",
          difficulty: "intermediate" as const,
          duration: 45,
          goal: "strength",
          exercises: [
            { id: "ex-1", name: "Bench Press", sets: 3, reps: 10, rest: 60 },
            { id: "ex-2", name: "Squats", sets: 3, reps: 12, rest: 60 },
            { id: "ex-3", name: "Pull-ups", sets: 3, reps: 8, rest: 60 },
            { id: "ex-4", name: "Deadlifts", sets: 3, reps: 10, rest: 90 },
          ],
          imageUrl: "/placeholder.svg?height=200&width=300",
          createdAt: new Date().toISOString(),
          isRecommended: true,
        },
        {
          id: "rec-2",
          title: "HIIT Cardio Blast",
          description: "High intensity interval training to burn calories and improve cardiovascular health",
          difficulty: "advanced" as const,
          duration: 30,
          goal: "cardio",
          exercises: [
            { id: "ex-5", name: "Burpees", sets: 4, reps: 15, rest: 30 },
            { id: "ex-6", name: "Mountain Climbers", sets: 4, reps: 20, rest: 30 },
            { id: "ex-7", name: "Jump Squats", sets: 4, reps: 15, rest: 30 },
            { id: "ex-8", name: "High Knees", sets: 4, reps: 30, rest: 30 },
          ],
          imageUrl: "/placeholder.svg?height=200&width=300",
          createdAt: new Date().toISOString(),
          isRecommended: true,
        },
        {
          id: "rec-3",
          title: "Beginner Fitness",
          description: "Perfect for beginners looking to start their fitness journey",
          difficulty: "beginner" as const,
          duration: 30,
          goal: "general fitness",
          exercises: [
            { id: "ex-9", name: "Push-ups (Modified)", sets: 2, reps: 10, rest: 60 },
            { id: "ex-10", name: "Bodyweight Squats", sets: 2, reps: 12, rest: 60 },
            { id: "ex-11", name: "Plank", sets: 2, reps: "30 sec", rest: 60 },
            { id: "ex-12", name: "Walking Lunges", sets: 2, reps: 10, rest: 60 },
          ],
          imageUrl: "/placeholder.svg?height=200&width=300",
          createdAt: new Date().toISOString(),
          isRecommended: true,
        },
      ]

      const mockUserWorkouts = [
        {
          id: "user-1",
          title: "My Leg Day",
          description: "Personal leg workout focusing on quads and hamstrings",
          difficulty: "intermediate" as const,
          duration: 50,
          goal: "strength",
          exercises: [
            { id: "ex-13", name: "Barbell Squats", sets: 4, reps: 8, rest: 90 },
            { id: "ex-14", name: "Romanian Deadlifts", sets: 3, reps: 10, rest: 60 },
            { id: "ex-15", name: "Leg Press", sets: 3, reps: 12, rest: 60 },
            { id: "ex-16", name: "Calf Raises", sets: 4, reps: 15, rest: 45 },
          ],
          imageUrl: "/placeholder.svg?height=200&width=300",
          createdAt: new Date().toISOString(),
          isRecommended: false,
        },
      ]

      // Mock workout logs
      const mockWorkoutLogs = [
        {
          id: "log-1",
          workoutId: "rec-1",
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 48,
          notes: "Felt good, increased weight on bench press",
          exercises: [
            { id: "ex-1", name: "Bench Press", sets: 3, reps: 10, weight: 135, completed: true },
            { id: "ex-2", name: "Squats", sets: 3, reps: 12, weight: 185, completed: true },
            { id: "ex-3", name: "Pull-ups", sets: 3, reps: 8, weight: 0, completed: true },
            { id: "ex-4", name: "Deadlifts", sets: 3, reps: 10, weight: 225, completed: true },
          ],
        },
        {
          id: "log-2",
          workoutId: "user-1",
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 55,
          notes: "Legs were sore after, need to stretch more next time",
          exercises: [
            { id: "ex-13", name: "Barbell Squats", sets: 4, reps: 8, weight: 175, completed: true },
            { id: "ex-14", name: "Romanian Deadlifts", sets: 3, reps: 10, weight: 155, completed: true },
            { id: "ex-15", name: "Leg Press", sets: 3, reps: 12, weight: 270, completed: true },
            { id: "ex-16", name: "Calf Raises", sets: 4, reps: 15, weight: 100, completed: true },
          ],
        },
      ]

      set({
        recommendedWorkouts: mockRecommendedWorkouts,
        userWorkouts: mockUserWorkouts,
        workouts: [...mockRecommendedWorkouts, ...mockUserWorkouts],
        favorites: ["rec-1"],
        notificationSettings: {
          "rec-1": true,
          "user-1": false,
        },
        workoutLogs: mockWorkoutLogs,
        loading: false,
      })
    } catch (error) {
      console.error("Error fetching workouts:", error)
      set({ loading: false })
    }
  },

  // Create a new workout
  createWorkout: (newWorkout) => {
    const workoutWithId = {
      ...newWorkout,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRecommended: false,
    }

    set((state) => ({
      userWorkouts: [...state.userWorkouts, workoutWithId],
      workouts: [...state.recommendedWorkouts, ...state.userWorkouts, workoutWithId],
    }))
  },

  // Update an existing workout
  updateWorkout: (updatedWorkout) => {
    set((state) => {
      const updatedUserWorkouts = state.userWorkouts.map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout,
      )

      return {
        userWorkouts: updatedUserWorkouts,
        workouts: [...state.recommendedWorkouts, ...updatedUserWorkouts],
      }
    })
  },

  // Delete a workout
  deleteWorkout: (workoutId) => {
    set((state) => {
      const updatedUserWorkouts = state.userWorkouts.filter((workout) => workout.id !== workoutId)

      // Also remove from favorites if it was favorited
      const updatedFavorites = state.favorites.includes(workoutId)
        ? state.favorites.filter((id) => id !== workoutId)
        : state.favorites

      return {
        userWorkouts: updatedUserWorkouts,
        workouts: [...state.recommendedWorkouts, ...updatedUserWorkouts],
        favorites: updatedFavorites,
      }
    })
  },

  // Log a workout
  logWorkout: (workoutLog) => {
    const logWithId = {
      ...workoutLog,
      id: `log-${Date.now()}`,
      date: new Date().toISOString(),
    }

    set((state) => ({
      workoutLogs: [logWithId, ...state.workoutLogs],
    }))
  },

  // Toggle favorite status
  toggleFavorite: (workoutId) => {
    set((state) => {
      if (state.favorites.includes(workoutId)) {
        return { favorites: state.favorites.filter((id) => id !== workoutId) }
      } else {
        return { favorites: [...state.favorites, workoutId] }
      }
    })
  },

  // Toggle notification settings
  toggleNotification: (workoutId) => {
    set((state) => ({
      notificationSettings: {
        ...state.notificationSettings,
        [workoutId]: !state.notificationSettings[workoutId],
      },
    }))
  },

  // Set active tab
  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },

  // Set search term
  setSearchTerm: (term) => {
    set({ searchTerm: term })
  },

  // Set filter option
  setFilterOption: (option, value) => {
    set((state) => ({
      filterOptions: {
        ...state.filterOptions,
        [option]: value,
      },
    }))
  },

  // Get workout logs for a specific workout
  getWorkoutLogs: (workoutId) => {
    return get().workoutLogs.filter((log) => log.workoutId === workoutId)
  },

  // Reset store to initial state
  reset: () => {
    set({
      workouts: [],
      recommendedWorkouts: [],
      userWorkouts: [],
      favorites: [],
      workoutLogs: [],
      notificationSettings: {},
      loading: false,
      activeTab: "all",
      searchTerm: "",
      filterOptions: {
        difficulty: "all",
        duration: "all",
        goal: "all",
      },
    })
  },
}))

