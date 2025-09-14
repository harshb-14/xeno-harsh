import { useState, useEffect, useCallback } from 'react'
import { DashboardService } from '../services/dashboardService'
import { Stats, OrderByDate, TopCustomer, DateFilter } from '../types/dashboard'
import { useApi } from './useApi'

interface DashboardData {
  stats: Stats
  ordersByDate: OrderByDate[]
  topCustomers: TopCustomer[]
}

export const useDashboardData = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [ordersByDate, setOrdersByDate] = useState<OrderByDate[]>([])
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([])
  const api = useApi<DashboardData>()

  const fetchDashboardData = useCallback(async (dateFilter?: DateFilter) => {
    const data = await api.execute(() => DashboardService.getAllDashboardData(dateFilter))
    if (data) {
      setStats(data.stats)
      setOrdersByDate(data.ordersByDate)
      setTopCustomers(data.topCustomers)
    }
  }, [api.execute])

  const refreshData = useCallback((dateFilter?: DateFilter) => {
    return fetchDashboardData(dateFilter)
  }, [fetchDashboardData])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    ordersByDate,
    topCustomers,
    loading: api.loading,
    error: api.error,
    refreshData,
    fetchDashboardData
  }
}