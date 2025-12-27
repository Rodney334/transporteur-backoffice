// lib/services/user-service.ts
import { api } from "@/lib/api/axios";
import { GenderType, GrantedRole } from "@/type/enum";
import { User } from "@/type/user.type";

export interface UpdateProfileData {
  name: string;
  phoneNumber: string;
  countryCode: string;
  genderrole: GenderType;
}

export interface ChangePasswordData {
  password: string;
  newpassword: string;
  confirmpassword: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/user");
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await api.get<User>(`/user/${id}`);
    return response.data;
  },

  async updateProfile(userId: string, data: UpdateProfileData) {
    const response = await api.put(`/user/${userId}`, data);
    return response.data;
  },

  async changePassword(userId: string, data: ChangePasswordData) {
    const response = await api.put(`/user/${userId}/password`, data);
    return response.data;
  },

  async promoteUser(userId: string, role: GrantedRole): Promise<User> {
    const response = await api.patch<User>(`/user/${userId}/promote`, { role });
    return response.data;
  },
};
