import axios from "axios";
import { CreateUserDto, LoginDto, AuthResponse } from "./types/user";

const API_BASE_URL = "http://localhost:3000";

export async function createUser(user: CreateUserDto) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/`, user);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to create user");
    }
    throw new Error("Unexpected error");
  }
}

export async function loginUser(credentials: LoginDto): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
    throw new Error("Unexpected error");
  }
}

export async function updateUser(id: number, user: Partial<CreateUserDto>, token: string) {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Update user error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to update user");
    }
    throw new Error("Unexpected error");
  }
}

export async function getUsers(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("Unexpected error");
  }
}

export async function getUserByEmail(email: string, token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/email/${email}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
    throw new Error("Unexpected error");
  }
}

export async function getAdminById(id: number,token: string) {  
  try {
    const response = await axios.get(`${API_BASE_URL}/users/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
    throw new Error("Unexpected error");
  }
}

export async function getExercises(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch exercises");
    }
    throw new Error("Unexpected error");
  }
}

export async function getExercisesById(id: number, token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/exercises/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch exercises");
    }
    throw new Error("Unexpected error");
  }
}

export async function getWorkouts(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch workouts");
    }
    throw new Error("Unexpected error");
  }
}

export async function createWorkout(data: any, token: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/workouts`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Create workout error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to create workout");
    }
    throw new Error("Unexpected error");
  }
}

export async function updateWorkout(id: number, data: any, token: string) {
  try {
    console.log(`Sending PUT request to /workouts/${id}`, data);
    const response = await axios.put(`${API_BASE_URL}/workouts/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Update response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Update workout error details:', error.response?.data);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update workout");
    }
    throw error;
  }
}

export async function deleteWorkout(id: number, token: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/workouts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete workout");
    }
    throw new Error("Unexpected error");
  }
}

export const logWorkout = async (token: string, workoutLog: WorkoutLog) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/workouts/sessions/`, workoutLog, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to log workout');
    }
    throw new Error('Unexpected error');
  }
};


export const getLogWorkout = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts/sessions/log`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to get workout logs');
    }
    throw new Error('Unexpected error');
  }
};

interface WorkoutLog {
  workoutId: number;
  date: string;
  exercises: {
    exerciseId: number;
    setsCompleted: number;
    repsCompleted: number;
    weightUsed: number;
  }[];
}

export async function getNutritionLog(token: string, userId: number, date: Date) {
  try {
    const response = await axios.get(`${API_BASE_URL}/nutrition/logs/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: date.toISOString().split("T")[0] },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch nutrition logs");
    }
    throw new Error("Unexpected error");
  }
}

export async function getUserById(id: number, token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
    throw new Error("Unexpected error");
  }
}

export function getUserIdFromToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

export async function getWeeklySummary(token: string, weekStart: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { weekStart }
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch weekly summary");
    }
    throw new Error("Unexpected error");
  }
}

// api.ts
export async function deleteUser(id: number, token: string) {
  try {
    console.log("Sending DELETE request for user ID:", id); // Debugging log
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Delete user response:", response.data); // Debugging log
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || "Failed to delete user";
      const status = error.response?.status;
      console.error("Delete user error:", {
        message: errorMessage,
        status,
        data: error.response?.data,
      });
      throw new Error(errorMessage);
    }
    console.error("Unexpected error deleting user:", error);
    throw new Error("Unexpected error occurred while deleting user");
  }
}
export async function promoteUser(id: number, token: string, role = "admin", permissions = {}) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/users/${id}/promote`,
      { role, permissions },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Promote user error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to promote user");
    }
    throw new Error("Unexpected error");
  }
}

export async function getNotifications(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Get notifications error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to fetch notifications");
    }
    throw new Error("Unexpected error");
  }
}

export async function createNotification(notification: any, token: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/notifications/`, notification, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Create notification error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to create notification");
    }
    throw new Error("Unexpected error");
  }
}

export async function updateNotification(id: number, notification: any, token: string) {
  try {
    const response = await axios.put(`${API_BASE_URL}/notifications/${id}`, notification, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Update notification error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to update notification");
    }
    throw new Error("Unexpected error");
  }
}

export async function deleteNotification(id: number, token: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Delete notification error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete notification");
    }
    throw new Error("Unexpected error");
  }
}

export async function notifyPayment(token: string, userId: number, phone: string, amount: number) {
  try {
    const response = await axios.post(`${API_BASE_URL}/notify/pay/`, {
      userId,
      phone,
      amount,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Notify payment error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to notify payment");
    }
    throw new Error("Unexpected error");
  }
}

export async function getNotificationsByUser(userId: number, token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Get user notifications error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to fetch user notifications");
    }
    throw new Error("Unexpected error");
  }
}

export const createNutritionLog = async (
  token: string,
  logData: {
    date: string;
    mealType: string;
    totalCalories: number;
    protein: number;
    carbs: number;
    fats: number;
    hydration: number;
    foodItems: {
      fdcId: string;
      description: string;
      servingSize: number;
      unit: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
    }[];
  }
) => {
  try {
    // Get user ID from token
    const userId = getUserIdFromToken(token);
    if (!userId) {
      throw new Error("No user ID found in token");
    }

    // Format the data to match the Prisma schema
    const requestBody = {
      userId,
      date: logData.date,
      mealType: logData.mealType,
      totalCalories: parseFloat(logData.totalCalories.toString()),
      protein: parseFloat(logData.protein.toString()),
      carbs: parseFloat(logData.carbs.toString()),
      fats: parseFloat(logData.fats.toString()),
      hydration: parseFloat(logData.hydration.toString()),
      foodItems: logData.foodItems.map((item) => ({
        fdcId: item.fdcId,
        description: item.description,
        servingSize: parseFloat(item.servingSize.toString()),
        unit: item.unit,
        calories: parseFloat(item.calories.toString()),
        protein: parseFloat(item.protein.toString()),
        carbs: parseFloat(item.carbs.toString()),
        fats: parseFloat(item.fats.toString()),
      })),
    };

    console.log("Sending nutrition log data:", requestBody); // Add logging

    const response = await axios.post(`${API_BASE_URL}/nutrition/logs`, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Nutrition log error:", error.response?.data); // Add error logging
      throw new Error(error.response?.data?.error || "Failed to create nutrition log");
    }
    throw new Error("Unexpected error");
  }
};

// api

export async function fetchTotalUserCount(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.totalUsers;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch user count");
    }
    throw new Error("Unexpected error");
  }
}

export async function getAdmins(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch admins");
    }
    throw new Error("Unexpected error");
  }
}
export async function fetchTotalWorkoutCount(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts/count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.totalWorkouts;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch workout count");
    }
    throw new Error("Unexpected error");
  }
}

export async function getNotificationCount(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/notifications/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return Array.isArray(response.data) ? response.data.length : 0;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch notifications");
    }
    throw new Error("Unexpected error");
  }
}

export async function getWorkoutCount(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/workouts/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return typeof response.data.totalWorkouts === 'number' ? response.data.totalWorkouts : 0;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch workout count");
    }
    throw new Error("Unexpected error");
  }
}


export async function getUserBadges(token: string): Promise<{ totalSessions: number; badge: string }> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/workouts/user/badges`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch badges");
    }
    throw new Error("Unexpected error");
  }
}

export async function getWorkoutStreak(token: string): Promise<{ streak: number }> {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/workouts/streak`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch streak");
    }
    throw new Error("Unexpected error");
  }
}