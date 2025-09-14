'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { useSync } from '../../hooks/useSync'
import { Sidebar } from '../../components/dashboard/Sidebar'
import { DashboardHeader } from '../../components/dashboard/DashboardHeader'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { Icon } from '../../components/ui/Icon'
import { customerEventService, type CustomerEvent } from '../../services/customerEventService'

const EventTypeCard = ({ type, count, value }: { type: string, count: number, value: number }) => {
  const getEventInfo = (eventType: string) => {
    switch (eventType) {
      case 'cart_abandoned':
        return { 
          icon: 'shopping-cart' as const, 
          label: 'Cart Abandoned', 
          color: 'text-red-600', 
          bgColor: 'bg-red-50',
          iconBg: 'bg-red-100'
        }
      case 'checkout_started':
        return { 
          icon: 'user-check' as const, 
          label: 'Checkout Started', 
          color: 'text-blue-600', 
          bgColor: 'bg-blue-50',
          iconBg: 'bg-blue-100'
        }
      case 'product_viewed':
        return { 
          icon: 'package' as const, 
          label: 'Product Viewed', 
          color: 'text-green-600', 
          bgColor: 'bg-green-50',
          iconBg: 'bg-green-100'
        }
      default:
        return { 
          icon: 'activity' as const, 
          label: 'Other Events', 
          color: 'text-gray-600', 
          bgColor: 'bg-gray-50',
          iconBg: 'bg-gray-100'
        }
    }
  }

  const eventInfo = getEventInfo(type)

  return (
    <div className={`${eventInfo.bgColor} rounded-lg border border-gray-100 p-6`}>
      <div className="flex items-center">
        <div className={`w-12 h-12 ${eventInfo.iconBg} rounded-lg flex items-center justify-center`}>
          <Icon name={eventInfo.icon} size={24} className={eventInfo.color} />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{eventInfo.label}</p>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
          <p className="text-xs text-gray-500 mt-1">₹{value.toLocaleString()} total value</p>
        </div>
      </div>
    </div>
  )
}

export default function CustomerEvents() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated, tenant, isLoading: authLoading, logout, requireAuth } = useAuth()
  const { syncing, syncData } = useSync()
  const [events, setEvents] = useState<CustomerEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    requireAuth()
  }, [requireAuth])

  // Fetch customer events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all events without filtering - we'll filter on client side
        const eventData = await customerEventService.getCustomerEvents({})
        setEvents(eventData)
      } catch (err) {
        console.error('Error fetching customer events:', err)
        setError('Failed to load customer events. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (tenant && isAuthenticated) {
      fetchEvents()
    }
  }, [tenant, isAuthenticated])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSync = async () => {
    const success = await syncData()
    if (success) {
      // Refresh events after sync - fetch all events
      try {
        const eventData = await customerEventService.getCustomerEvents({})
        setEvents(eventData)
      } catch (err) {
        console.error('Error refreshing events after sync:', err)
      }
    }
  }

  if (authLoading || loading) {
    return <LoadingSpinner message="Loading customer events..." />
  }

  if (!isAuthenticated) {
    return null
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter)

  const eventStats = {
    cart_abandoned: events.filter(e => e.type === 'cart_abandoned'),
    checkout_started: events.filter(e => e.type === 'checkout_started'),
    total_value: events.reduce((sum, e) => sum + (e.value || 0), 0)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar} 
        onLogout={logout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          tenant={tenant} 
          onSync={handleSync} 
          syncing={syncing}
          onMenuToggle={toggleSidebar}
          title="Customer Events"
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Events</h1>
              <p className="text-gray-600">Track customer behavior and engagement across your store</p>
            </div>

            {/* Event Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <EventTypeCard 
                type="cart_abandoned" 
                count={eventStats.cart_abandoned.length}
                value={eventStats.cart_abandoned.reduce((sum, e) => sum + (e.value || 0), 0)}
              />
              <EventTypeCard 
                type="checkout_started" 
                count={eventStats.checkout_started.length}
                value={eventStats.checkout_started.reduce((sum, e) => sum + (e.value || 0), 0)}
              />
              <div className="bg-purple-50 rounded-lg border border-gray-100 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Icon name="trending-up" size={24} className="text-purple-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">₹{eventStats.total_value.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Across all events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
                {[
                  { key: 'all', label: 'All Events' },
                  { key: 'cart_abandoned', label: 'Cart Abandoned' },
                  { key: 'checkout_started', label: 'Checkout Started' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      filter === key 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
                
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="calendar-days" size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No events found for the selected filter</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Event</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Value</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Products</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredEvents.map((event) => {
                          const eventInfo = event.type === 'cart_abandoned' 
                            ? { label: 'Cart Abandoned', color: 'text-red-600', bg: 'bg-red-50' }
                            : { label: 'Checkout Started', color: 'text-blue-600', bg: 'bg-blue-50' }
                          
                          return (
                            <tr key={event.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${eventInfo.bg} ${eventInfo.color}`}>
                                  {eventInfo.label}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{event.customerName}</p>
                                  <p className="text-xs text-gray-500">{event.customerEmail}</p>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-gray-600">{formatDate(event.timestamp)}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm font-semibold text-green-600">₹{(event.value || 0).toLocaleString()}</span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm text-gray-600">{event.products.length} items</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}