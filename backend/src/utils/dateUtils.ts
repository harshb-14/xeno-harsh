// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Parse date string safely
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
};

// Get date range for queries
export const getDateRange = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return null;
  
  return {
    gte: parseDate(startDate),
    lte: parseDate(endDate)
  };
};