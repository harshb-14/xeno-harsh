'use client'

import React from 'react'
import { AuthTenant } from '../../types/auth'
import { Icon } from '../ui/Icon'

interface DashboardHeaderProps {
  tenant: AuthTenant | null
  onSync: () => void
  syncing: boolean
  onMenuToggle: () => void
  title?: string
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  tenant,
  onSync,
  syncing,
  onMenuToggle,
  title = 'Dashboard'
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon name="menu" size={24} />
            </button>
            <div>
              {tenant && (
                <p className="text-xl font-semibold text-gray-900 hidden sm:block">
                  {tenant.name}
                </p>
              )}
              <h1 className="text-sm text-gray-500">{title}</h1>
            </div>
          </div>

          {/* Right side - Sync Button */}
          <div className="flex items-center">
            <button
              onClick={onSync}
              disabled={syncing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {syncing ? (
                <>
                  <Icon name="loader" size={16} className="animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Icon name="refresh" size={16} />
                  <span>Sync Data</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}