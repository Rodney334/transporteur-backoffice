// types/promo.type.ts
export enum PromoType { PERCENT = "PERCENT", FIXED = "FIXED" };
export enum PromoChannel { PUBLIC = "PUBLIC", PARTNER = "PARTNER", VIP = "VIP" };

export interface PromoConstraints {
  maxDiscount?: number;
  minOrderAmount?: number;
  firstTimeOnly?: boolean;
  applicableServices?: string[];
  applicableZones?: string[];
}

export interface AssignedUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  maxDiscount: number | null;
  minOrderAmount: number;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  startsAt: string | null;
  endsAt: string | null;
  constraints: PromoConstraints | null;
  isActive: boolean;
  companyId: string | null;
  campaignId: string | null;
  assignedUserId: string | null;
  channel: PromoChannel;
  createdAt: string;
  updatedAt: string;
  eligibilityMode: "USERS" | "ALL" | string;
  eligibleRole: string | null;
  maxUsers: number | null;
  hasAssignedUsers: boolean;
  assignedUsersCount: number;
  assignedUsers?: AssignedUser[];
}

export interface CreatePromoDto {
  code: string;
  type: PromoType;
  value: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  constraints?: PromoConstraints | null;
  channel: PromoChannel;
  isActive: boolean;
  eligibilityMode?: "USERS" | "ALL" | string;
  eligibleRole?: string | null;
  maxUsers?: number | null;
}

export interface UpdatePromoDto {
  code?: string;
  type?: PromoType;
  value?: number;
  maxDiscount?: number | null;
  minOrderAmount?: number;
  usageLimit?: number | null;
  usageLimitPerUser?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  constraints?: PromoConstraints | null;
  channel?: PromoChannel;
  isActive?: boolean;
  eligibilityMode?: "USERS" | "ALL" | string;
  eligibleRole?: string | null;
  maxUsers?: number | null;
}

export interface Partner {
  id: string;
  name: string;
  codePrefix: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerDto {
  name: string;
  codePrefix: string;
  isActive: boolean;
}

export interface UpdatePartnerDto {
  name?: string;
  codePrefix?: string;
  isActive?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignDto {
  name: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface UpdateCampaignDto {
  name?: string;
  startsAt?: string;
  endsAt?: string;
  isActive?: boolean;
}

export interface BatchPromoDto {
  campaignId: string;
  count: number;
  type: PromoType;
  value: number;
  maxDiscount: number;
  minOrderAmount: number;
  usageLimit: number;
  usageLimitPerUser: number;
  startsAt: string;
  endsAt: string;
  channel: PromoChannel;
}

export interface PromoExportData {
  id: string;
  code: string;
  type: string;
  value: string;
  isActive: string;
  usageLimit: string;
  usageLimitPerUser: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  channel: string;
  companyId: string;
  campaignId: string;
  assignedUserId: string;
  minOrderAmount: string;
  maxDiscount: string;
  constraints: string;
  eligibilityMode: string;
  eligibleRole: string;
  maxUsers: string;
  hasAssignedUsers: string;
  assignedUsersCount: string;
  assignedUsers: string;
}

export interface ClientPromoItem {
  promoId: string;
  promoType: PromoType;
  promoValue: number;
  code: string;
  valid: boolean;
  reason: string | null;
  usedByUser: number;
  totalUsed: number;
  remainingUser: number;
  remainingGlobal: number | null;
  discount?: number;
  finalAmount?: number;
  minOrderAmount: number;
  constraints: PromoConstraints | null;
  eligibilityMode: string;
  eligibleRole: string | null;
  isWhitelisted: boolean;
  userRole: string;
}

export interface PromoUsageSchema {
  used: ClientPromoItem[];
  available: ClientPromoItem[];
  unavailable: ClientPromoItem[];
  total: number;
}

export type PromoUsageResponse = PromoUsageSchema;

export interface PromoUserEligibilityDto {
  code: string;
  userIds: string[];
  mode: "ADD" | "SET";
}
