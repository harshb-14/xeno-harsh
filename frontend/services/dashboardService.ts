import { apiClient } from './apiClient'
import { Stats, OrderByDate, TopCustomer, DateFilter } from '../types/dashboard'

export class DashboardService {
  static async getStats(): Promise<Stats> {
    const response = await apiClient.get<Stats>('/api/dashboard/stats')
    return response.data
  }

  static async getOrdersByDate(dateFilter?: DateFilter): Promise<OrderByDate[]> {
    let url = '/api/dashboard/orders-by-date'
    const params: any = {}
    
    if (dateFilter?.startDate && dateFilter?.endDate) {
      params.startDate = dateFilter.startDate
      params.endDate = dateFilter.endDate
    }
    
    const response = await apiClient.get<OrderByDate[]>(url, params)
    return response.data
  }

  static async getTopCustomers(): Promise<TopCustomer[]> {
    const response = await apiClient.get<TopCustomer[]>('/api/dashboard/top-customers')
    return response.data
  }

  static async getAllDashboardData(dateFilter?: DateFilter): Promise<{
    stats: Stats
    ordersByDate: OrderByDate[]
    topCustomers: TopCustomer[]
  }> {
    const [stats, ordersByDate, topCustomers] = await Promise.all([
      this.getStats(),
      this.getOrdersByDate(dateFilter),
      this.getTopCustomers()
    ])

    return {
      stats,
      ordersByDate,
      topCustomers
    }
  }
}