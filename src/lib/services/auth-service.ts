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
  signupIntent: "livreur" | "client";
  genderrole: GenderType;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
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
  refreshToken: string;
}

export interface VerifyEmailData {
  email: string;
  token: string;
}

// NOUVEAU : Type pour renvoyer la vérification
export interface ResendVerificationData {
  email: string;
}

// NOUVEAU : Interface pour la réponse de vérification d'email
interface VerifyEmailResponse {
  message: string;
}

// NOUVEAU : Interface pour la réponse de renvoi de vérification
interface ResendVerificationResponse {
  message: string;
}

// NOUVEAU : Types pour le mot de passe oublié
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

// NOUVEAU : Interfaces de réponse
interface ForgotPasswordResponse {
  message: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const authService = {
  async login(credentials: LoginData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  async register(userData: RegisterData): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      userData,
    );
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  async logout(fcmToken: string): Promise<void> {
    await api.post("/auth/logout", { fcmToken });
  },

  // NOUVEAU : Rafraîchissement des tokens
  async refreshTokens(): Promise<RefreshTokenResponse> {
    const { useAuthStore } = await import("@/lib/stores/auth-store");
    const refreshToken = useAuthStore.getState().refreshToken;

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post<RefreshTokenResponse>(
      "https://letransporteur-production.up.railway.app/api/v1/auth/refresh",
      { refreshToken },
    );
    return response.data;
  },

  // NOUVEAU : Envoyer le FCM token au serveur
  async sendFCMToken(token: string): Promise<void> {
    await api.post("/notifications/fcm-token", { token });
  },

  // NOUVEAU : Vérifier l'email
  async verifyEmail(data: VerifyEmailData): Promise<VerifyEmailResponse> {
    const response = await api.post<VerifyEmailResponse>(
      "/auth/verify-email",
      data,
    );
    return response.data;
  },

  // NOUVEAU : Renvoyer l'email de vérification
  async resendVerificationEmail(
    data: ResendVerificationData,
  ): Promise<ResendVerificationResponse> {
    const response = await api.post<ResendVerificationResponse>(
      "/auth/resend-verification",
      data,
    );
    return response.data;
  },

  // NOUVEAU : Demander la réinitialisation de mot de passe
  async forgotPassword(
    data: ForgotPasswordData,
  ): Promise<ForgotPasswordResponse> {
    const response = await api.post<ForgotPasswordResponse>(
      "/auth/forgot-password",
      data,
    );
    return response.data;
  },

  // NOUVEAU : Réinitialiser le mot de passe
  async resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    const response = await api.post<ResetPasswordResponse>(
      "/auth/reset-password",
      data,
    );
    return response.data;
  },
};
