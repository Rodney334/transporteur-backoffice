import { FormType } from "./enum";

export interface FormSubmission {
  _id: string;
  type: FormType;
  fullName: string;
  phoneNumber: string;
  email: string;
  country?: string;
  appliedPosition?: string;
  subject?: string;
  message?: string;
  isHandled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmissionsResponse {
  data: FormSubmission[];
  total: number;
  page: number;
  limit: number;
}
