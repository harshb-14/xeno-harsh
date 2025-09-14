'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useSync } from '../../hooks/useSync'
import { useDateFilter } from '../../hooks/useDateFilter'

// Components
import { Sidebar } from '../../components/dashboard/Sidebar'
import { DashboardHeader } from '../../components/dashboard/DashboardHeader'
import { StatsCards } from '../../components/dashboard/StatsCards'
import { OrdersByDateChart } from '../../components/dashboard/OrdersByDateChart'
import { TopCustomersTable } from '../../components/dashboard/TopCustomersTable'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { Icon } from '../../components/ui/Icon'

export default function Dashboard() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Hooks
  const { isAuthenticated, tenant, isLoading: authLoading, logout, requireAuth } = useAuth()
  const { 
    stats, 
    ordersByDate, 
    topCustomers, 
    loading: dashboardLoading, 
    error: dashboardError,
    refreshData 
  } = useDashboardData()
  const { syncing, syncData } = useSync()
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getDateFilter,
    clearDateFilter,
    hasDateFilter,
    isValidDateFilter
  } = useDateFilter()

  // Effects
  useEffect(() => {
    requireAuth()
  }, [isAuthenticated, authLoading])

  // Handlers
  const handleSync = async () => {
    const success = await syncData()
    if (success) {
      await refreshData(getDateFilter())
      // alert('Data synced successfully!')
    } else {
      alert('Sync failed. Please try again.')
    }
  }

  const handleDateFilter = async () => {
    if (!isValidDateFilter()) {
      alert('Please select valid start and end dates')
      return
    }
    await refreshData(getDateFilter())
  }

  const handleClearDateFilter = async () => {
    clearDateFilter()
    await refreshData()
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Loading state
  if (authLoading || dashboardLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null // requireAuth will handle redirect
  }

  // Error state
  if (dashboardError) {
    return (
      <ErrorMessage
        title="Dashboard Error"
        message={dashboardError}
        onRetry={() => refreshData(getDateFilter())}
      />
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          tenant={tenant}
          onSync={handleSync}
          syncing={syncing}
          onMenuToggle={toggleSidebar}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Core Stats Cards - Total customers, orders, and revenue */}
            <div className="mb-8">
              <StatsCards stats={stats} ordersByDate={ordersByDate} />
            </div>

            {/* Orders by Date Chart */}
            <div className="mb-8">
              <OrdersByDateChart 
                ordersByDate={ordersByDate} 
                dateFilter={hasDateFilter() && startDate && endDate ? { startDate, endDate } : undefined}
              />
            </div>

            {/* Top 5 Customers by Spend */}
            <div className="mb-8">
              <TopCustomersTable customers={topCustomers} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
