import { GenderType, GrantedRole } from "./enum";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  role: GrantedRole;
  genderrole: GenderType;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  refreshToken: string | null;
  resetPasswordCode?: string | null;
  resetPasswordExpires?: string | null;
  isEmailVerified?: boolean;
  profileImageUrl?: string | null;
  profileImagePublicId?: string | null;
  signupIntent?: "client" | "livreur";
  livreurRequestStatus?: "none" | "pending" | "approved" | "rejected";
  livreurRequestedAt?: string | null;
  livreurReviewedAt?: string | null;
  livreurReviewedBy?: string | null;
  livreurRejectionReason?: string | null;
}
