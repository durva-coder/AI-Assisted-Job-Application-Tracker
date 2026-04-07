import api from './client';
import type {
  AuthResponse,
  User,
  Application,
  ParsedJobDescription,
  DashboardStats,
} from '../types';

export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data;
  },
};

export const applicationApi = {
  getAll: async (): Promise<{ applications: Application[] }> => {
    const { data } = await api.get<{ applications: Application[] }>(
      '/applications'
    );
    return data;
  },

  getById: async (
    id: string
  ): Promise<{ application: Application }> => {
    const { data } = await api.get<{ application: Application }>(
      `/applications/${id}`
    );
    return data;
  },

  create: async (
    application: Partial<Application>
  ): Promise<{ application: Application }> => {
    const { data } = await api.post<{ application: Application }>(
      '/applications',
      application
    );
    return data;
  },

  update: async (
    id: string,
    application: Partial<Application>
  ): Promise<{ application: Application }> => {
    const { data } = await api.put<{ application: Application }>(
      `/applications/${id}`,
      application
    );
    return data;
  },

  updateStatus: async (
    id: string,
    status: Application['status']
  ): Promise<{ application: Application }> => {
    const { data } = await api.patch<{ application: Application }>(
      `/applications/${id}/status`,
      { status }
    );
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(
      `/applications/${id}`
    );
    return data;
  },

  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>('/applications/stats');
    return data;
  },
};

export const aiApi = {
  parseJobDescription: async (
    jobDescription: string
  ): Promise<{ parsed: ParsedJobDescription }> => {
    const { data } = await api.post<{ parsed: ParsedJobDescription }>(
      '/ai/parse-jd',
      { jobDescription }
    );
    return data;
  },

  getResumeSuggestions: async (
    jobDescription: string,
    role: string,
    requiredSkills: string[]
  ): Promise<{ suggestions: string[] }> => {
    const { data } = await api.post<{ suggestions: string[] }>(
      '/ai/resume-suggestions',
      { jobDescription, role, requiredSkills }
    );
    return data;
  },
};
