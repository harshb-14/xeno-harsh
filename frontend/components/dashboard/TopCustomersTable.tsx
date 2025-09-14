'use client'

import React, { useMemo } from 'react'
import { TopCustomer } from '../../types/dashboard'
import { Icon } from '../ui/Icon'
import { formatCurrency } from '../../utils/formatters'

interface TopCustomersTableProps {
  customers: TopCustomer[]
}

export const TopCustomersTable: React.FC<TopCustomersTableProps> = ({ customers }) => {
  const limitedCustomers = customers.slice(0, 5)

  const getDisplayName = (customer: TopCustomer): string => {
    if (customer.firstName && customer.lastName) {
      return `${customer.firstName} ${customer.lastName}`
    }
    if (customer.firstName) {
      return customer.firstName
    }
    if (customer.lastName) {
      return customer.lastName
    }
    return customer.email?.split('@')[0] || 'Anonymous'
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top 5 Customers by Spend</h3>
            <p className="text-sm text-gray-600">Your highest value customers ranked by total spending</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Customers</p>
            <p className="text-lg font-bold text-blue-600">{customers.length}</p>
          </div>
        </div>
        
        {limitedCustomers.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="users" size={48} className="text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No customer data available</p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Avg Order
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {limitedCustomers.map((customer, index) => {
                  const avgOrderValue = customer.ordersCount > 0 ? customer.totalSpent / customer.ordersCount : 0
                  const displayName = getDisplayName(customer)
                  
                  const getRankDisplay = (rank: number) => {
                    return { bg: 'bg-blue-100', text: 'text-blue-600', label: `${rank + 1}th` }
                  }
                  
                  const rankStyle = getRankDisplay(index)
                  
                  return (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${rankStyle.bg} ${rankStyle.text} text-sm font-semibold`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {displayName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{customer.email || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.ordersCount} orders
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-green-600">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatCurrency(avgOrderValue)}
                        </span>
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
  )
}
