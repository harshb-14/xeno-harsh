import { prisma } from './prisma';
import { AppError } from './asyncHandler';

// Get tenant by ID with error handling
export const getTenantById = async (tenantId: string) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId }
  });
  
  if (!tenant) {
    throw new AppError('Tenant not found', 404);
  }
  
  return tenant;
};

// Find tenant by shop domain
export const findTenantByShopDomain = async (domain: string) => {
  const tenant = await prisma.tenant.findFirst({
    where: {
      shopifyUrl: {
        contains: domain.replace('.myshopify.com', '')
      }
    }
  });
  
  if (!tenant) {
    throw new AppError('Tenant not found for domain', 404);
  }
  
  return tenant;
};