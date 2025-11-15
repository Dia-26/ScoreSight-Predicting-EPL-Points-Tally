import { FootballTeam } from './profile';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  created_at?: string;
  // Profile fields
  displayName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
  favoriteTeam?: FootballTeam;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  authMessage: string;
  clearMessage: () => void;
  // Profile methods
  updateProfile: (profileData: Partial<User>) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<boolean>;
  setFavoriteTeam: (team: FootballTeam) => Promise<boolean>;
  submitTestimonial: (rating: number, comment: string) => Promise<boolean>;
}