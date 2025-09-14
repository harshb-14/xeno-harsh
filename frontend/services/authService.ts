import { apiClient } from './apiClient'
import { storage } from '../utils/storage'
import { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials)
    return response.data
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', userData)
    return response.data
  }

  static saveAuthData(token: string, tenant: any): void {
    storage.setToken(token)
    storage.setTenant(tenant)
  }

  static getAuthData(): { token: string | null; tenant: any | null } {
    return {
      token: storage.getToken(),
      tenant: storage.getTenant()
    }
  }

  static clearAuthData(): void {
    storage.clearAuth()
  }

  static isAuthenticated(): boolean {
    return !!storage.getToken()
  }
}