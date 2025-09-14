export interface Stats {
  customers: number
  orders: number
  products: number
  revenue: number
}

export interface OrderByDate {
  date: string
  count: number
  revenue: number
}

export interface TopCustomer {
  id: string
  firstName?: string
  lastName?: string
  email?: string
  totalSpent: number
  ordersCount: number
}

export interface Tenant {
  id: string
  name: string
  shopifyUrl: string
  shopifyAccessToken: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DashboardData {
  stats: Stats
  ordersByDate: OrderByDate[]
  topCustomers: TopCustomer[]
}

export interface DateFilter {
  startDate?: string
  endDate?: string
}