export interface CreateUserDto {

    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
  
 
    selectedGender?: string | null;
    selectedBodyType?: string | null;
    selectedAgeGroup?: string | null;
    selectedHeight?: string | null;
    selectedWeight?: string | null;
    selectedGoal?: string | null;
    selectedBodyYouWant?: string | null;
    selectedLoseWeight?: boolean | null;
    selectedGainMuscle?: boolean | null;
    selectedGetShredded?: boolean | null;
    workoutFrequency?: number;
  }
  
  export interface LoginDto {
    email: string;
    password: string;
  }

  export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface DecodedToken {
    id: number;
    name: string;
    email: string;
    role: string;
  }
  