import React from 'react'
import { Icon } from './Icon'

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onRetry
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-8 rounded-lg shadow max-w-md w-full mx-4">
        <Icon name="alert-triangle" size={64} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-[#1063fe] hover:bg-[#0751dc] text-white px-6 py-3 rounded-md font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}