import React, { useState } from 'react'
import { STYLES } from '../../utils/constants'
import { validatePassword } from '../../utils/validation'

interface FormField {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
  required?: boolean
  autoComplete?: string
  helpText?: string
  showPasswordValidation?: boolean
}

interface AuthFormProps {
  title: string
  subtitle: string
  fields: FormField[]
  formData: Record<string, string>
  onFieldChange: (name: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  submitText: string
  loading: boolean
  error?: string | null
  alternativeAction: {
    text: string
    onClick: () => void
  }
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  subtitle,
  fields,
  formData,
  onFieldChange,
  onSubmit,
  submitText,
  loading,
  error,
  alternativeAction
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({})

  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }))
  }
  return (
    <div className={STYLES.CARD_GLASS}>
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {fields.map((field) => {
            const passwordValidation = field.showPasswordValidation && field.type === 'password' 
              ? validatePassword(formData[field.name] || '') 
              : null
            
            // Calculate password strength for progress bar
            const getPasswordStrength = () => {
              if (!passwordValidation) return 0
              const requirements = passwordValidation.requirements
              const metRequirements = Object.values(requirements).filter(Boolean).length
              return (metRequirements / 5) * 100 // 5 total requirements
            }
            
            const getProgressBarColor = () => {
              const strength = getPasswordStrength()
              if (strength === 0) return 'bg-gray-200'
              if (strength <= 40) return 'bg-blue-300'
              if (strength <= 80) return 'bg-blue-500'
              return 'bg-[#1063fe]'
            }
            
            return (
              <div key={field.id} className="text-left">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  {field.showPasswordValidation && (
                    <div className="inline-block ml-2 relative group">
                      <svg 
                        className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white/90 backdrop-blur-md text-gray-800 text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/30 shadow-lg">
                        <div className="space-y-1">
                          <div className="font-medium mb-1 text-gray-900">Password Requirements:</div>
                          <div className={`flex items-center ${passwordValidation?.requirements.minLength ? 'text-[#1063fe]' : 'text-gray-700'}`}>
                            {passwordValidation?.requirements.minLength ? (
                              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-3 h-3 mr-2 text-gray-400">•</span>
                            )}
                            At least 8 characters
                          </div>
                          <div className={`flex items-center ${passwordValidation?.requirements.hasLowercase ? 'text-[#1063fe]' : 'text-gray-700'}`}>
                            {passwordValidation?.requirements.hasLowercase ? (
                              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-3 h-3 mr-2 text-gray-400">•</span>
                            )}
                            One lowercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation?.requirements.hasUppercase ? 'text-[#1063fe]' : 'text-gray-700'}`}>
                            {passwordValidation?.requirements.hasUppercase ? (
                              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-3 h-3 mr-2 text-gray-400">•</span>
                            )}
                            One uppercase letter
                          </div>
                          <div className={`flex items-center ${passwordValidation?.requirements.hasNumber ? 'text-[#1063fe]' : 'text-gray-700'}`}>
                            {passwordValidation?.requirements.hasNumber ? (
                              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-3 h-3 mr-2 text-gray-400">•</span>
                            )}
                            One number
                          </div>
                          <div className={`flex items-center ${passwordValidation?.requirements.hasSpecialChar ? 'text-[#1063fe]' : 'text-gray-700'}`}>
                            {passwordValidation?.requirements.hasSpecialChar ? (
                              <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <span className="w-3 h-3 mr-2 text-gray-400">•</span>
                            )}
                            One special character (!@#$%^&*(),.?&quot;:{}|&lt;&gt;)
                          </div>
                        </div>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white/90"></div>
                      </div>
                    </div>
                  )}
                </label>
                <div className="relative">
                  <input
                    id={field.id}
                    name={field.name}
                    type={field.type === 'password' && passwordVisibility[field.name] ? 'text' : field.type}
                    autoComplete={field.autoComplete}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => onFieldChange(field.name, e.target.value)}
                    className={STYLES.INPUT_PRIMARY}
                    placeholder={field.placeholder}
                  />
                  
                  {/* Password Toggle Eye Icon */}
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field.name)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {passwordVisibility[field.name] ? (
                        // Eye icon (password is visible)
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        // Eye slash icon (password is hidden)
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Password Strength Progress Bar */}
                {passwordValidation && formData[field.name] && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                        style={{ width: `${getPasswordStrength()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password strength: {
                        getPasswordStrength() === 0 ? 'Very weak' :
                        getPasswordStrength() <= 40 ? 'Weak' :
                        getPasswordStrength() <= 80 ? 'Good' : 'Strong'
                      }
                    </p>
                  </div>
                )}
                
                {field.helpText && (
                  <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                )}
              </div>
            )
          })}

          <button
            type="submit"
            disabled={loading}
            className={STYLES.BUTTON_PRIMARY}
          >
            <div className="relative z-10">
              {loading ? `${submitText}...` : submitText}
            </div>
            <div className="absolute inset-0 bg-[#0751dc] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/20 backdrop-blur-sm text-gray-600 rounded-full">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={alternativeAction.onClick}
            className={STYLES.BUTTON_SECONDARY}
          >
            {alternativeAction.text}
          </button>
        </form>
      </div>
    </div>
  )
}