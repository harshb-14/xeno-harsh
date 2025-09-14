import { apiClient } from './apiClient'

export interface CustomerEvent {
  id: string
  type: 'cart_abandoned' | 'checkout_started' | 'product_viewed' | 'order_placed' | 'checkout_abandoned' | 'cart_updated'
  customerEmail: string | null
  customerName: string | null
  shopifyCustomerId: string | null
  timestamp: string // This maps to createdAt from backend
  value: number | null
  products: any
  metadata?: any
}

export interface CustomerEventStats {
  byType: Record<string, { count: number; totalValue: number }>
  totals: {
    count: number
    value: number
  }
}

export interface CustomerEventsResponse {
  events: Array<{
    id: string
    type: string
    customerEmail: string | null
    customerName: string | null
    shopifyCustomerId: string | null
    value: number | null
    products: any
    metadata: any
    createdAt: string
    updatedAt: string
    tenantId: string
  }>
  total: number
  limit: number
  offset: number
}

export const customerEventService = {
  // Get customer events with filtering and pagination
  async getCustomerEvents(filters?: {
    type?: string
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
  }): Promise<CustomerEvent[]> {
    try {
      const params: any = {}
      
      if (filters?.type) params.type = filters.type
      if (filters?.limit) params.limit = filters.limit
      if (filters?.offset) params.offset = filters.offset
      if (filters?.startDate) params.startDate = filters.startDate
      if (filters?.endDate) params.endDate = filters.endDate

      const response = await apiClient.get('/api/customer-events', params)
      const data = response.data
      
      // Transform backend response to frontend format
      return data.events.map((event: any) => ({
        id: event.id,
        type: event.type,
        customerEmail: event.customerEmail,
        customerName: event.customerName,
        shopifyCustomerId: event.shopifyCustomerId,
        timestamp: event.createdAt, // Map createdAt to timestamp
        value: event.value,
        products: event.products || [],
        metadata: event.metadata
      }))
    } catch (error) {
      console.error('Error fetching customer events:', error)
      throw new Error('Failed to fetch customer events')
    }
  },

  // Get customer event statistics
  async getCustomerEventStats(filters?: {
    startDate?: string
    endDate?: string
  }): Promise<CustomerEventStats> {
    try {
      const params: any = {}
      
      if (filters?.startDate) params.startDate = filters.startDate
      if (filters?.endDate) params.endDate = filters.endDate

      const response = await apiClient.get('/api/customer-events/stats', params)
      return response.data
    } catch (error) {
      console.error('Error fetching customer event stats:', error)
      throw new Error('Failed to fetch customer event stats')
    }
  },

  // Create a new customer event (for testing)
  async createCustomerEvent(eventData: {
    type: string
    customerEmail?: string
    customerName?: string
    shopifyCustomerId?: string
    value?: number
    products?: any
    metadata?: any
  }): Promise<CustomerEvent> {
    try {
      const response = await apiClient.post('/api/customer-events', eventData)
      const data = response.data
      
      return {
        id: data.id,
        type: data.type,
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        shopifyCustomerId: data.shopifyCustomerId,
        timestamp: data.createdAt,
        value: data.value,
        products: data.products || [],
        metadata: data.metadata
      }
    } catch (error) {
      console.error('Error creating customer event:', error)
      throw new Error('Failed to create customer event')
    }
  }
}