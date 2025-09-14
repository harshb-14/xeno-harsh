// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate required fields
export const validateRequired = (fields: Record<string, any>): string[] => {
  const missing = [];
  
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(key);
    }
  }
  
  return missing;
};

// Validate Shopify URL format
export const isValidShopifyUrl = (url: string): boolean => {
  return url.includes('.myshopify.com') && !url.startsWith('http');
};