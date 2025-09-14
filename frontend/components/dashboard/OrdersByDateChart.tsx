'use client'

import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'
import { OrderByDate } from '../../types/dashboard'
import { formatCurrency } from '../../utils/formatters'
import { Icon, type IconName } from '../ui/Icon'

interface OrdersByDateChartProps {
  ordersByDate: OrderByDate[]
  dateFilter?: {
    startDate: string
    endDate: string
  }
}

type ChartType = 'line' | 'area' | 'bar'
type DataType = 'orders' | 'revenue'
type TimePeriod = 'month' | 'quarter' | 'half-yearly' | 'annually' | 'custom'

export const OrdersByDateChart: React.FC<OrdersByDateChartProps> = ({ 
  ordersByDate, 
  dateFilter 
}) => {
  const [chartType, setChartType] = useState<ChartType>('line')
  const [dataType, setDataType] = useState<DataType>('orders')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [showDateModal, setShowDateModal] = useState(false)
  const [customDateRange, setCustomDateRange] = useState<{startDate: string, endDate: string} | null>(null)

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    if (period === 'custom') {
      setShowDateModal(true)
    } else {
      setTimePeriod(period)
      setCustomDateRange(null) // Clear custom range when switching to other periods
    }
  }

  // Handle custom date range apply
  const handleCustomDateApply = (startDate: string, endDate: string) => {
    setCustomDateRange({ startDate, endDate })
    setTimePeriod('custom')
    setShowDateModal(false)
  }

  // Helper function to group data by time period
  const groupDataByPeriod = (data: OrderByDate[], period: TimePeriod) => {
    const grouped: { [key: string]: { count: number; revenue: number; dates: string[] } } = {}
    
    data.forEach(item => {
      const date = new Date(item.date)
      let key = ''
      
      switch (period) {
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
          break
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1
          key = `${date.getFullYear()}-Q${quarter}`
          break
        case 'half-yearly':
          const half = date.getMonth() < 6 ? 'H1' : 'H2'
          key = `${date.getFullYear()}-${half}`
          break
        case 'annually':
          key = `${date.getFullYear()}`
          break
      }
      
      if (!grouped[key]) {
        grouped[key] = { count: 0, revenue: 0, dates: [] }
      }
      
      grouped[key].count += item.count
      grouped[key].revenue += item.revenue || 0
      grouped[key].dates.push(item.date)
    })
    
    return Object.entries(grouped).map(([key, value]) => ({
      date: key,
      count: value.count,
      revenue: value.revenue,
      displayDate: key
    })).sort((a, b) => a.date.localeCompare(b.date))
  }

  // Filter and process data based on date range and time period
  const filteredData = useMemo(() => {
    let data = ordersByDate

    // Apply custom date filter if custom period is selected and dates are set
    if (timePeriod === 'custom' && customDateRange?.startDate && customDateRange?.endDate) {
      const start = new Date(customDateRange.startDate)
      const end = new Date(customDateRange.endDate)
      data = ordersByDate.filter(order => {
        const orderDate = new Date(order.date)
        return orderDate >= start && orderDate <= end
      })
    } else if (dateFilter?.startDate && dateFilter?.endDate && timePeriod !== 'custom') {
      // Apply existing date filter for non-custom periods
      const start = new Date(dateFilter.startDate)
      const end = new Date(dateFilter.endDate)
      data = ordersByDate.filter(order => {
        const orderDate = new Date(order.date)
        return orderDate >= start && orderDate <= end
      })
    }

    // Group data by selected time period
    if (timePeriod === 'month' || timePeriod === 'custom') {
      // For month and custom view, show individual days
      return data.map(order => ({
        ...order,
        displayDate: new Date(order.date).toLocaleDateString('en', { 
          month: 'short', 
          day: 'numeric' 
        }),
        revenue: order.revenue || 0
      }))
    } else {
      // For other periods, group the data
      return groupDataByPeriod(data, timePeriod)
    }
  }, [ordersByDate, dateFilter, timePeriod, customDateRange])

  const totalValue = filteredData.reduce((sum, item) => 
    sum + (dataType === 'orders' ? item.count : item.revenue), 0
  )

  const averageValue = filteredData.length > 0 ? totalValue / filteredData.length : 0

  // Calculate Y-axis domain for better scaling
  const getYAxisDomain = (): [number, number] | undefined => {
    if (filteredData.length === 0) return [0, 10]
    
    const values = filteredData.map(item => 
      dataType === 'orders' ? item.count : item.revenue
    )
    const maxValue = Math.max(...values)
    const minValue = Math.min(...values)
    
    if (dataType === 'orders') {
      // For orders, ensure we show whole numbers with a bit of padding
      const padding = Math.max(1, Math.ceil(maxValue * 0.1))
      return [0, maxValue + padding]
    } else {
      // For revenue, provide proper scaling from 0 to max with 20% padding
      const padding = Math.ceil(maxValue * 0.2)
      return [0, maxValue + padding]
    }
  }

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    const tooltipFormatter = (value: any, name: any) => [
      dataType === 'revenue' ? formatCurrency(Number(value)) : Number(value).toLocaleString(),
      dataType === 'orders' ? 'Orders' : 'Revenue'
    ]

      // Colors: orders = blue, revenue = green
      const orderColor = '#3B82F6' // blue-500
      const orderActive = '#1E40AF' // blue-900
      const revenueColor = '#10B981' // green-500
      const revenueActive = '#047857' // green-700

      const strokeColor = dataType === 'orders' ? orderColor : revenueColor
      const activeColor = dataType === 'orders' ? orderActive : revenueActive
      const gradientId = dataType === 'orders' ? 'orderGradient' : 'revenueGradient'

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={dataType === 'revenue'}
              domain={getYAxisDomain()}
              tickFormatter={(value) => 
                dataType === 'revenue' ? `₹${(value / 1000).toFixed(0)}k` : Math.round(value).toString()
              }
            />
            <Tooltip formatter={tooltipFormatter} />
            <Area
              type="monotone"
              dataKey={dataType === 'orders' ? 'count' : 'revenue'}
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={dataType === 'revenue'}
              domain={getYAxisDomain()}
              tickFormatter={(value) => 
                dataType === 'revenue' ? `₹${(value / 1000).toFixed(0)}k` : Math.round(value).toString()
              }
            />
            <Tooltip formatter={tooltipFormatter} />
            <Bar 
              dataKey={dataType === 'orders' ? 'count' : 'revenue'}
              fill={strokeColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )
      
      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="displayDate" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={dataType === 'revenue'}
              domain={getYAxisDomain()}
              tickFormatter={(value) => 
                dataType === 'revenue' ? `₹${(value / 1000).toFixed(0)}k` : Math.round(value).toString()
              }
            />
            <Tooltip formatter={tooltipFormatter} />
            <Line 
              type="monotone" 
              dataKey={dataType === 'orders' ? 'count' : 'revenue'}
              stroke={strokeColor} 
              strokeWidth={3}
              dot={{ r: 4, fill: strokeColor }}
              activeDot={{ r: 6, fill: activeColor }}
            />
          </LineChart>
        )
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {dataType === 'orders' ? 'Orders' : 'Revenue'} by Date
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-600">
              Total: {dataType === 'revenue' ? formatCurrency(totalValue) : totalValue.toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              Average: {dataType === 'revenue' ? formatCurrency(averageValue) : Math.round(averageValue).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {/* Time Period Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'month' as TimePeriod, label: 'Month' },
              { key: 'quarter' as TimePeriod, label: 'Quarter' },
              { key: 'half-yearly' as TimePeriod, label: 'Half Year' },
              { key: 'annually' as TimePeriod, label: 'Annual' },
              { key: 'custom' as TimePeriod, label: 'Custom' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTimePeriodChange(key)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  timePeriod === key 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Data Type Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDataType('orders')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                dataType === 'orders' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setDataType('revenue')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                dataType === 'revenue' 
                  ? 'bg-white text-green-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Revenue
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex space-x-1">
            {[
              { type: 'line' as ChartType, icon: 'line-chart' as IconName },
              { type: 'area' as ChartType, icon: 'area-chart' as IconName },
              { type: 'bar' as ChartType, icon: 'bar-chart' as IconName }
            ].map(({ type, icon }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`p-2 rounded-lg transition-colors ${
                  chartType === type 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} Chart`}
              >
                <Icon name={icon} size={16} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Data Summary */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t pt-4">
        <div>
          <p className="text-xs text-gray-500">Data Points</p>
          <p className="text-sm font-semibold text-gray-900">{filteredData.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Peak Day</p>
          <p className="text-sm font-semibold text-gray-900">
            {filteredData.length > 0 
              ? filteredData.reduce((peak, current) => 
                  (dataType === 'orders' ? current.count : current.revenue) > 
                  (dataType === 'orders' ? peak.count : peak.revenue) ? current : peak
                ).displayDate
              : 'N/A'
            }
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-sm font-semibold text-gray-900">
            {filteredData.length > 7 ? 'Active' : 
             filteredData.length > 0 ? 'Limited Data' : 'No Data'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Range</p>
          <p className="text-sm font-semibold text-gray-900">
            {filteredData.length > 0 ? `${filteredData.length} days` : 'No data'}
          </p>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Custom Date Range</h3>
              <button
                onClick={() => setShowDateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon name="close" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  const startDate = (document.getElementById('startDate') as HTMLInputElement)?.value
                  const endDate = (document.getElementById('endDate') as HTMLInputElement)?.value
                  
                  if (startDate && endDate) {
                    handleCustomDateApply(startDate, endDate)
                  }
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Apply Filter
              </button>
              <button
                onClick={() => setShowDateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}