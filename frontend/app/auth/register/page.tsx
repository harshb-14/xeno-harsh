'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { AuthLayout } from '../../../components/ui/AuthLayout'
import { AuthForm } from '../../../components/ui/AuthForm'
import { ROUTES } from '../../../utils/constants'
import { validatePassword } from '../../../utils/validation'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shopifyUrl: '',
    accessToken: ''
  })
  const [formErrors, setFormErrors] = useState<string[]>([])
  const router = useRouter()
  const { register, registerLoading, registerError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate password before submission
    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setFormErrors(['Please ensure your password meets all requirements'])
      return
    }
    
    // Clear any previous errors
    setFormErrors([])
    
    const success = await register(formData)
    if (success) {
      router.push(ROUTES.DASHBOARD)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const fields = [
    {
      id: 'name',
      name: 'name',
      type: 'text',
      label: 'Store Name',
      placeholder: 'Enter your store name',
      required: true
    },
    {
      id: 'email',
      name: 'email',
      type: 'email',
      label: 'Email address',
      placeholder: 'Enter your email',
      required: true,
      autoComplete: 'email'
    },
    {
      id: 'password',
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Create a password',
      required: true,
      autoComplete: 'new-password',
      showPasswordValidation: true
    },
    {
      id: 'shopifyUrl',
      name: 'shopifyUrl',
      type: 'text',
      label: 'Shopify Store URL',
      placeholder: 'mystore.myshopify.com',
      required: true,
      helpText: 'e.g., mystore.myshopify.com'
    },
    {
      id: 'accessToken',
      name: 'accessToken',
      type: 'text',
      label: 'Shopify Access Token',
      placeholder: 'Enter your access token',
      required: true,
      helpText: 'Get this from your Shopify admin under Apps & sales channels'
    }
  ]

  return (
    <AuthLayout maxWidth="lg">
      <AuthForm
        title="Register your Shopify store"
        subtitle="Connect your store and start analyzing"
        fields={fields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitText="Register Store"
        loading={registerLoading}
        error={registerError || (formErrors.length > 0 ? formErrors.join(', ') : null)}
        alternativeAction={{
          text: 'Already have an account? Sign in',
          onClick: () => router.push(ROUTES.LOGIN)
        }}
      />
    </AuthLayout>
  )
}
