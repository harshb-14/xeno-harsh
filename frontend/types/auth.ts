export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  shopifyUrl: string
  accessToken: string
}

export interface AuthTenant {
  id: string
  name: string
  email: string
  shopifyUrl: string
  isActive: boolean
}

export interface AuthResponse {
  token: string
  tenant: AuthTenant
}