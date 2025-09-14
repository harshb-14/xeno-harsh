'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from '../components/ui/AuthLayout'
import { STYLES, ROUTES } from '../utils/constants'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthLayout>
      <div className="rounded-3xl p-8 border border-white/30">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-gray-800">
              Get Started @ Xeno
            </h2>
            <p className="text-gray-600">
              Access your insights dashboard
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => router.push(ROUTES.LOGIN)}
              className={STYLES.BUTTON_PRIMARY}
            >
              <div className="relative z-10">Login to Dashboard</div>
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
              onClick={() => router.push(ROUTES.REGISTER)}
              className={STYLES.BUTTON_SECONDARY}
            >
              Register New Store
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Connect your Shopify store in under 2 minutes
          </p>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="hidden lg:flex flex-wrap gap-4 text-sm justify-center mt-8">
        <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-[#1063fe]">
          <div className="w-2 h-2 bg-[#1063fe] rounded-full"></div>
          <span className="text-gray-700 font-medium">Real-time Analytics</span>
        </div>
        <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-sm rounded-full px-4 py-2 border border-[#1063fe]">
          <div className="w-2 h-2 bg-[#1063fe] rounded-full"></div>
          <span className="text-gray-700 font-medium">Customer Insights</span>
        </div>
      </div>
    </AuthLayout>
  )
}
