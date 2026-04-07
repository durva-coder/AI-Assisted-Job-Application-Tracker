export type ApplicationStatus =
  | 'Applied'
  | 'Phone Screen'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface Application {
  _id: string;
  company: string;
  role: string;
  jdLink?: string;
  notes?: string;
  dateApplied: string;
  status: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority?: string;
  location?: string;
  resumeSuggestions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ParsedJobDescription {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
}

export interface DashboardStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  recentApplications: Application[];
}
