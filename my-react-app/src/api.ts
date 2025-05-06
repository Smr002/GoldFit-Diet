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
    const response = await axios.put(`${API_BASE_URL}/workouts/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to update workout");
    }
    throw new Error("Unexpected error");
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

export async function deleteUser(id: number, token: string) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Delete user error:", error.response?.data);
      throw new Error(error.response?.data?.error || "Failed to delete user");
    }
    throw new Error("Unexpected error");
  }
}

export async function promoteUser(id: number, token: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/users/${id}/promote`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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