// lib/types/livreur.type.ts
import { User } from "@/type/user.type";
import { LivreurVerificationStatus } from "@/type/enum";

export interface LivreurProfile {
  _id: string;
  user: User;
  userId: string;
  motoPlateNumber?: string;
  motoChassisNumber?: string;
  motoBrand?: string;
  motoModel?: string;
  ifuNumber?: string;
  idType?: string;
  idNumber?: string;
  verificationStatus: LivreurVerificationStatus;
  verificationNote?: string | null;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateLivreurProfileData {
  motoPlateNumber?: string;
  motoChassisNumber?: string;
  motoBrand?: string;
  motoModel?: string;
  ifuNumber?: string;
  idType?: string;
  idNumber?: string;
}

export interface ApproveRejectData {
  note?: string;
}
