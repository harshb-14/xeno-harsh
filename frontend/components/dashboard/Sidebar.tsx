'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Icon, type IconName } from '../ui/Icon'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  onLogout: () => void
}

interface MenuItem {
  id: string
  label: string
  icon: IconName
  path: string
  badge?: string
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
    { id: 'customer-events', label: 'Customer Events', icon: 'calendar-days', path: '/customer-events', badge: 'NEW' }
  ]

  const handleItemClick = (item: MenuItem) => {
    router.push(item.path)
    if (isOpen) {
      onToggle() // Close sidebar on mobile after navigation
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    setShowLogoutModal(false)
    onLogout()
  }

  const cancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
        w-72
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div>
              <span className="font-bold text-xl text-gray-900">Shopify - Xeno</span>
              <p className="text-xs text-gray-500">Analytics Platform</p>
            </div>
          </div>
          <button 
            onClick={onToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon name="close" size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 group
                  ${pathname === item.path 
                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                    ${pathname === item.path 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-600'
                    }
                  `}>
                    <Icon name={item.icon} size={20} />
                  </div>
                  <div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                </div>
                {item.badge && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Icon name="logout" size={18} className="group-hover:text-red-600" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <button
                onClick={cancelLogout}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <Icon name="alert-triangle" size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Are you sure you want to logout?</p>
                  <p className="text-sm text-gray-500">You'll need to sign in again to access your dashboard.</p>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}