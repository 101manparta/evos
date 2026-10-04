import { apiClient } from './client';
import { Driver, Expense, User, Company } from '../../types';

export const authApi = {
  login: (credentials: { email: string; password?: string }) =>
    apiClient.post<{ token: string; user: User; company: Company }>('/auth/login', credentials),

  register: (payload: { company_name: string; full_name: string; email: string; password?: string }) =>
    apiClient.post<{ token: string; user: User; company: Company }>('/auth/register', payload),

  logout: () => apiClient.post<{ message: string }>('/auth/logout'),

  getMe: () => apiClient.get<{ user: User; company: Company }>('/auth/me'),

  forgotPassword: (email: string) =>
    apiClient.post<{ message: string; recovery_token: string; expires_in_minutes: number }>('/auth/forgot-password', { email }),

  resetPassword: (payload: { email: string; token: string; new_password: string }) =>
    apiClient.post<{ message: string }>('/auth/reset-password', payload),
};

export const vehicleApi = {
  list: () => apiClient.get<any[]>('/vehicles'),
  get: (id: string) => apiClient.get<any>(`/vehicles/${id}`),
  create: (vehicle: any) => apiClient.post<any>('/vehicles', vehicle),
  update: (id: string, updates: any) => apiClient.patch<any>(`/vehicles/${id}`, updates),
  delete: (id: string) => apiClient.delete<any>(`/vehicles/${id}`),
};

export const driverApi = {
  list: () => apiClient.get<Driver[]>('/drivers'),
  get: (id: string) => apiClient.get<Driver>(`/drivers/${id}`),
  create: (driver: Partial<Driver>) => apiClient.post<Driver>('/drivers', driver),
  update: (id: string, updates: Partial<Driver>) => apiClient.patch<Driver>(`/drivers/${id}`, updates),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/drivers/${id}`),
};

export const tripApi = {
  list: () => apiClient.get<any[]>('/trips'),
  get: (id: string) => apiClient.get<any>(`/trips/${id}`),
  create: (trip: any) => apiClient.post<any>('/trips', trip),
  update: (id: string, updates: any) => apiClient.patch<any>(`/trips/${id}`, updates),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/trips/${id}`),
};

export const chargingApi = {
  list: () => apiClient.get<any[]>('/charging'),
  get: (id: string) => apiClient.get<any>(`/charging/${id}`),
  create: (session: any) => apiClient.post<any>('/charging', session),
  update: (id: string, updates: any) => apiClient.patch<any>(`/charging/${id}`, updates),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/charging/${id}`),
};

export const maintenanceApi = {
  list: () => apiClient.get<any[]>('/maintenance'),
  get: (id: string) => apiClient.get<any>(`/maintenance/${id}`),
  create: (record: any) => apiClient.post<any>('/maintenance', record),
  update: (id: string, updates: any) => apiClient.patch<any>(`/maintenance/${id}`, updates),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/maintenance/${id}`),
};

export const expenseApi = {
  list: (params?: { category?: string; vehicle_id?: string; status?: string }) => {
    let query = '';
    if (params) {
      const q = new URLSearchParams();
      if (params.category) q.append('category', params.category);
      if (params.vehicle_id) q.append('vehicle_id', params.vehicle_id);
      if (params.status) q.append('status', params.status);
      const str = q.toString();
      if (str) query = `?${str}`;
    }
    return apiClient.get<Expense[]>(`/expenses${query}`);
  },
  get: (id: string) => apiClient.get<Expense>(`/expenses/${id}`),
  create: (expense: Partial<Expense>) => apiClient.post<Expense>('/expenses', expense),
  update: (id: string, updates: Partial<Expense>) => apiClient.patch<Expense>(`/expenses/${id}`, updates),
  delete: (id: string) => apiClient.delete<{ message: string }>(`/expenses/${id}`),
};

export const moneyLeakApi = {
  list: () => apiClient.get<any[]>('/money-leaks'),
  resolve: (id: string) => apiClient.patch<any>(`/money-leaks/${id}`, { status: 'Resolved' }),
};

export const dashboardApi = {
  getSummary: () => apiClient.get<any>('/dashboard/summary'),
};

export const simulationApi = {
  run: (params: any) => apiClient.post<any>('/simulations', params),
};

export const reportApi = {
  exportReport: (reportType: string, format: string) =>
    apiClient.post<any>('/reports/export', { report_type: reportType, format }),
};

export const adminApi = {
  getDashboard: () => apiClient.get<any>('/admin/dashboard'),
  listCompanies: () => apiClient.get<any[]>('/admin/companies'),
  toggleCompanyStatus: (id: string) => apiClient.post<any>(`/admin/companies/${id}/toggle-status`),
  listUsers: () => apiClient.get<any[]>('/admin/users'),
  getAuditLogs: () => apiClient.get<any[]>('/admin/audit-logs'),
};
