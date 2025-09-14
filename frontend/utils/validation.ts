export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateShopifyUrl = (url: string): boolean => {
  if (!validateUrl(url)) return false
  return url.includes('.myshopify.com')
}

export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
  requirements: {
    minLength: boolean
    hasLowercase: boolean
    hasUppercase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
  }
} => {
  const errors: string[] = []
  
  const requirements = {
    minLength: password.length >= 8,
    hasLowercase: /(?=.*[a-z])/.test(password),
    hasUppercase: /(?=.*[A-Z])/.test(password),
    hasNumber: /(?=.*\d)/.test(password),
    hasSpecialChar: /(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)
  }
  
  if (!requirements.minLength) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!requirements.hasLowercase) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!requirements.hasUppercase) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!requirements.hasNumber) {
    errors.push('Password must contain at least one number')
  }
  
  if (!requirements.hasSpecialChar) {
    errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    requirements
  }
}

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) {
    return `${fieldName} is required`
  }
  return null
}