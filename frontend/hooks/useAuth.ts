import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../services/authService'
import { AuthTenant } from '../types/auth'
import { ROUTES } from '../utils/constants'
import { useApi } from './useApi'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [tenant, setTenant] = useState<AuthTenant | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()
  const loginApi = useApi()
  const registerApi = useApi()

  const checkAuthStatus = useCallback(() => {
    const { token, tenant: tenantData } = AuthService.getAuthData()
    setIsAuthenticated(!!token)
    setTenant(tenantData)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const response = await loginApi.execute(() => AuthService.login({ email, password }))
    if (response) {
      AuthService.saveAuthData(response.token, response.tenant)
      setIsAuthenticated(true)
      setTenant(response.tenant)
      return true
    }
    return false
  }, [loginApi.execute])

  const register = useCallback(async (userData: {
    name: string
    email: string
    password: string
    shopifyUrl: string
    accessToken: string
  }): Promise<boolean> => {
    const response = await registerApi.execute(() => AuthService.register(userData))
    if (response) {
      AuthService.saveAuthData(response.token, response.tenant)
      setIsAuthenticated(true)
      setTenant(response.tenant)
      return true
    }
    return false
  }, [registerApi.execute])

  const logout = useCallback(() => {
    AuthService.clearAuthData()
    setIsAuthenticated(false)
    setTenant(null)
    router.push(ROUTES.HOME)
  }, [router])

  const requireAuth = useCallback(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN)
    }
  }, [isLoading, isAuthenticated, router])

  return {
    isAuthenticated,
    tenant,
    isLoading,
    login,
    register,
    logout,
    requireAuth,
    checkAuthStatus,
    loginError: loginApi.error,
    registerError: registerApi.error,
    loginLoading: loginApi.loading,
    registerLoading: registerApi.loading
  }
}