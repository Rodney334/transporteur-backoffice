// lib/stores/users-store.ts
import { create } from "zustand";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  setSelectedUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  promoteUser: (userId: string, role: GrantedRole) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, ...updates } : user
      ),
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user._id !== userId),
    })),

  setSelectedUser: (user) => set({ selectedUser: user }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  promoteUser: (userId, role) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, role } : user
      ),
    })),
}));
