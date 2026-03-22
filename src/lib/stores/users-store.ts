// lib/stores/users-store.ts
import { create } from "zustand";
import { User } from "@/type/user.type";
import { GrantedRole } from "@/type/enum";
import { LivreurProfile } from "@/type/livreur.type"; // IMPORT NOUVEAU
import { Review, ReviewStat } from "@/type/review.type";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;

  // NOUVEAU : État pour le modal livreur
  selectedLivreur: User | null;
  livreurProfile: LivreurProfile | null;
  isLivreurModalOpen: boolean;
  
  // NOUVEAU : État pour les avis livreur
  livreurReviews: Review[];
  livreurReviewStat: ReviewStat | null;
  isReviewsModalOpen: boolean;

  // Actions existantes
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  removeUser: (userId: string) => void;
  setSelectedUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  promoteUser: (userId: string, role: GrantedRole) => void;

  // NOUVEAU : Actions pour le livreur
  setSelectedLivreur: (user: User | null) => void;
  setLivreurProfile: (profile: LivreurProfile | null) => void;
  openLivreurModal: (user: User) => void;
  closeLivreurModal: () => void;

  // NOUVEAU : Actions pour les avis livreur
  setLivreurReviews: (reviews: Review[]) => void;
  setLivreurReviewStat: (stat: ReviewStat | null) => void;
  openReviewsModal: (user: User) => void;
  closeReviewsModal: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,

  // NOUVEAU : État pour le modal livreur
  selectedLivreur: null,
  livreurProfile: null,
  isLivreurModalOpen: false,

  // NOUVEAU : État pour les avis livreur
  livreurReviews: [],
  livreurReviewStat: null,
  isReviewsModalOpen: false,

  // Actions existantes
  setUsers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (userId, updates) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === userId ? { ...user, ...updates } : user,
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
        user._id === userId ? { ...user, role } : user,
      ),
    })),

  // NOUVEAU : Actions pour le livreur
  setSelectedLivreur: (user) => set({ selectedLivreur: user }),
  setLivreurProfile: (profile) => set({ livreurProfile: profile }),
  openLivreurModal: (user) =>
    set({
      selectedLivreur: user,
      isLivreurModalOpen: true,
    }),
  closeLivreurModal: () =>
    set({
      selectedLivreur: null,
      livreurProfile: null,
      isLivreurModalOpen: false,
    }),

  // NOUVEAU : Actions pour les avis livreur
  setLivreurReviews: (reviews) => set({ livreurReviews: reviews }),
  setLivreurReviewStat: (stat) => set({ livreurReviewStat: stat }),
  openReviewsModal: (user) =>
    set({
      selectedLivreur: user,
      isReviewsModalOpen: true,
    }),
  closeReviewsModal: () =>
    set({
      selectedLivreur: null,
      livreurReviews: [],
      livreurReviewStat: null,
      isReviewsModalOpen: false,
    }),
}));

// // lib/stores/users-store.ts
// import { create } from "zustand";
// import { User } from "@/type/user.type";
// import { GrantedRole } from "@/type/enum";

// interface UsersState {
//   users: User[];
//   selectedUser: User | null;
//   isLoading: boolean;
//   error: string | null;
//   setUsers: (users: User[]) => void;
//   addUser: (user: User) => void;
//   updateUser: (userId: string, updates: Partial<User>) => void;
//   removeUser: (userId: string) => void;
//   setSelectedUser: (user: User | null) => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
//   clearError: () => void;
//   promoteUser: (userId: string, role: GrantedRole) => void;
// }

// export const useUsersStore = create<UsersState>((set) => ({
//   users: [],
//   selectedUser: null,
//   isLoading: false,
//   error: null,

//   setUsers: (users) => set({ users }),

//   addUser: (user) =>
//     set((state) => ({
//       users: [...state.users, user],
//     })),

//   updateUser: (userId, updates) =>
//     set((state) => ({
//       users: state.users.map((user) =>
//         user._id === userId ? { ...user, ...updates } : user
//       ),
//     })),

//   removeUser: (userId) =>
//     set((state) => ({
//       users: state.users.filter((user) => user._id !== userId),
//     })),

//   setSelectedUser: (user) => set({ selectedUser: user }),

//   setLoading: (isLoading) => set({ isLoading }),

//   setError: (error) => set({ error }),

//   clearError: () => set({ error: null }),

//   promoteUser: (userId, role) =>
//     set((state) => ({
//       users: state.users.map((user) =>
//         user._id === userId ? { ...user, role } : user
//       ),
//     })),
// }));
