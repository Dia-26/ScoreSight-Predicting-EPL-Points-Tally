// src/types/profile.ts
export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  location?: string;
  favoriteTeam?: FootballTeam;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FootballTeam {
  id: number;
  name: string;
  shortName: string;
  crest: string;
  league: string;
}

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved: boolean;
}