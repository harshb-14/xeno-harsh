import { useState } from 'react'
import { DateFilter } from '../types/dashboard'

export const useDateFilter = () => {
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const getDateFilter = (): DateFilter | undefined => {
    if (startDate && endDate) {
      return { startDate, endDate }
    }
    return undefined
  }

  const clearDateFilter = () => {
    setStartDate('')
    setEndDate('')
  }

  const hasDateFilter = (): boolean => {
    return !!(startDate && endDate)
  }

  const isValidDateFilter = (): boolean => {
    if (!startDate || !endDate) return false
    return new Date(startDate) <= new Date(endDate)
  }

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    getDateFilter,
    clearDateFilter,
    hasDateFilter,
    isValidDateFilter
  }
}