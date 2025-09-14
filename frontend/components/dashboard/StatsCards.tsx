import React from 'react'
import { Stats } from '../../types/dashboard'
import { OrderByDate } from '../../types/dashboard'
import { formatCurrency, formatNumber } from '../../utils/formatters'
import { calculateAnalytics, getRevenuePerCustomer, getAverageOrderValue } from '../../utils/analytics'
import { Icon } from '../ui/Icon'

interface StatsCardsProps {
  stats: Stats | null
  ordersByDate: OrderByDate[]
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, subtitle }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
          {icon}
        </div>
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
)

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, ordersByDate }) => {
  const analytics = calculateAnalytics(stats, ordersByDate)
  const revenuePerCustomer = getRevenuePerCustomer(stats)
  const averageOrderValue = getAverageOrderValue(stats)

  const statsData = [
    {
      title: 'Total Customers',
      value: formatNumber(stats?.customers || 0),
      icon: <Icon name="users" size={24} />,
      subtitle: `${formatCurrency(revenuePerCustomer)} per customer`
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats?.orders || 0),
      icon: <Icon name="shopping-cart" size={24} />,
      subtitle: `${formatCurrency(averageOrderValue)} avg value`
    },
    {
      title: 'Total Products',
      value: formatNumber(stats?.products || 0),
      icon: <Icon name="package" size={24} />,
      subtitle: `${Math.round((stats?.revenue || 0) / (stats?.products || 1))} revenue/product`
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.revenue || 0),
      icon: <Icon name="dollar-sign" size={24} />,
      subtitle: `Total business revenue`
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  )
}