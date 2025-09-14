// Centralized storage utilities
export const storage = {
  // Token management
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  },

  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  // Tenant management
  getTenant: (): any | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem('tenant');
    return data ? JSON.parse(data) : null;
  },

  setTenant: (tenant: any): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tenant', JSON.stringify(tenant));
    }
  },

  removeTenant: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tenant');
    }
  },

  // Clear all auth data
  clearAuth: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('tenant');
    }
  }
};