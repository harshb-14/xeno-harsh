import React from 'react'

interface DateFilterProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onApplyFilter: () => void
  onClearFilter: () => void
  hasDateFilter: boolean
  isValidDateFilter: boolean
}

export const DateFilter: React.FC<DateFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
  hasDateFilter,
  isValidDateFilter
}) => {
  const handleApplyFilter = () => {
    if (!isValidDateFilter) {
      alert('Please select valid start and end dates')
      return
    }
    onApplyFilter()
  }

  return (
    <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Orders by Date</h3>
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={handleApplyFilter}
            disabled={!hasDateFilter}
            className="bg-[#1063fe] hover:bg-[#0751dc] text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Apply Filter
          </button>
          <button
            onClick={onClearFilter}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Clear Filter
          </button>
        </div>
      </div>
    </div>
  )
}