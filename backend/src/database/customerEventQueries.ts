import { prisma } from '../utils/prisma'

interface CustomerEventFilters {
  type?: string
  limit: number
  offset: number
  startDate?: string
  endDate?: string
}

interface CustomerEventData {
  type: string
  customerEmail?: string
  customerName?: string
  shopifyCustomerId?: string
  value?: number | null
  products?: any
  metadata?: any
  tenantId: string
}

interface EventStatsFilters {
  startDate?: string
  endDate?: string
}

// Get customer events for a tenant with filtering and pagination
export const getCustomerEvents = async (tenantId: string, filters: CustomerEventFilters) => {
  const where: any = {
    tenantId
  }

  // Add filters
  if (filters.type) {
    where.type = filters.type
  }

  if (filters.startDate) {
    where.createdAt = {
      ...where.createdAt,
      gte: new Date(filters.startDate)
    }
  }

  if (filters.endDate) {
    where.createdAt = {
      ...where.createdAt,
      lte: new Date(filters.endDate)
    }
  }

  const events = await prisma.customerEvent.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    take: filters.limit,
    skip: filters.offset
  })

  const total = await prisma.customerEvent.count({ where })

  return {
    events,
    total,
    limit: filters.limit,
    offset: filters.offset
  }
}

// Create a new customer event
export const createCustomerEvent = async (data: CustomerEventData) => {
  return await prisma.customerEvent.create({
    data: {
      type: data.type,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      shopifyCustomerId: data.shopifyCustomerId,
      value: data.value,
      products: data.products,
      metadata: data.metadata,
      tenantId: data.tenantId
    }
  })
}

// Get aggregated statistics for customer events
export const getCustomerEventStats = async (tenantId: string, filters: EventStatsFilters) => {
  const where: any = {
    tenantId
  }

  // Add date filters
  if (filters.startDate) {
    where.createdAt = {
      ...where.createdAt,
      gte: new Date(filters.startDate)
    }
  }

  if (filters.endDate) {
    where.createdAt = {
      ...where.createdAt,
      lte: new Date(filters.endDate)
    }
  }

  // Get counts by event type
  const eventTypeCounts = await prisma.customerEvent.groupBy({
    by: ['type'],
    where,
    _count: {
      id: true
    },
    _sum: {
      value: true
    }
  })

  // Format the stats
  const stats = eventTypeCounts.reduce((acc, item) => {
    acc[item.type] = {
      count: item._count.id,
      totalValue: item._sum.value || 0
    }
    return acc
  }, {} as Record<string, { count: number; totalValue: number }>)

  // Get total counts
  const totalEvents = await prisma.customerEvent.count({ where })
  const totalValueResult = await prisma.customerEvent.aggregate({
    where,
    _sum: {
      value: true
    }
  })

  return {
    byType: stats,
    totals: {
      count: totalEvents,
      value: totalValueResult._sum.value || 0
    }
  }
}

// Get recent customer events for dashboard
export const getRecentCustomerEvents = async (tenantId: string, limit: number = 10) => {
  return await prisma.customerEvent.findMany({
    where: { tenantId },
    orderBy: {
      createdAt: 'desc'
    },
    take: limit
  })
}