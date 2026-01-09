import { api } from "@/lib/api/axios";
import { User } from "@/lib/stores/auth-store";
import { GenderType, GrantedRole } from "@/type/enum";
import axios from "axios";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  genderrole: GenderType;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RegisterResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  countryCode: string;
  role: GrantedRole;
  genderrole: GenderType;
  resetPasswordCode: string | null;
  resetPasswordExpires: string | null;
  createdAt: string;
  updatedAt: string;
  refreshToken: string | null;
  isArchived: boolean;
}

// NOUVEAU : Interface pour la réponse du refresh
interface RefreshTokenResponse {
  accessToken: string;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  // NOUVEAU : Rafraîchissement des tokens
  async refreshTokens(): Promise<RefreshTokenResponse> {
    console.log("call refresh token");
    const response = await axios.post<RefreshTokenResponse>(
      "https://letransporteur-production.up.railway.app/api/v1/auth/refresh",
      {}
    );
    console.log(response.data);
    return response.data;
  },
};
