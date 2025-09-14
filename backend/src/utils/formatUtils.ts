// Convert string to number safely
export const safeParseFloat = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Convert string to integer safely
export const safeParseInt = (value: string | number, defaultValue: number = 0): number => {
  if (typeof value === 'number') return Math.floor(value);
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Truncate string to max length
export const truncateString = (str: string, maxLength: number): string => {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};