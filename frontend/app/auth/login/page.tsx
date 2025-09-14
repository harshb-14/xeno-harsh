'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { AuthLayout } from '../../../components/ui/AuthLayout'
import { AuthForm } from '../../../components/ui/AuthForm'
import { ROUTES } from '../../../utils/constants'

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()
  const { login, loginLoading, loginError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(formData.email, formData.password)
    if (success) {
      router.push(ROUTES.DASHBOARD)
    }
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const fields = [
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
      placeholder: 'Enter your password',
      required: true,
      autoComplete: 'current-password'
    }
  ]

  return (
    <AuthLayout>
      <AuthForm
        title="Sign in to your store"
        subtitle="Access your analytics dashboard"
        fields={fields}
        formData={formData}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        submitText="Sign in"
        loading={loginLoading}
        error={loginError}
        alternativeAction={{
          text: 'Create New Account',
          onClick: () => router.push(ROUTES.REGISTER)
        }}
      />
    </AuthLayout>
  )
}