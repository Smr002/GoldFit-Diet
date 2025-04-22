import axios from "axios";
import { CreateUserDto, LoginDto, AuthResponse } from "./types/user";

const API_BASE_URL =  "http://localhost:3000";

export async function createUser(user: CreateUserDto) {
  try {
   console.log("Creating user:", user); 
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

export async function getUsers(token: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch workouts");
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