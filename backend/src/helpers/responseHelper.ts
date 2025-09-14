// Format tenant data for API response
export const formatTenantResponse = (tenant: any) => ({
  id: tenant.id,
  name: tenant.name,
  email: tenant.email,
  shopifyUrl: tenant.shopifyUrl
});

// Format success response
export const successResponse = (message: string, data?: any) => ({
  message,
  ...data
});

// Format error response
export const errorResponse = (error: string) => ({
  error
});