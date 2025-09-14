export const formatCurrency = (amount: number, currency = '₹'): string => {
  return `${currency}${amount.toFixed(2)}`
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

export const getCustomerDisplayName = (
  firstName?: string,
  lastName?: string,
  fallback = 'Unknown Customer'
): string => {
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  return fallback
}