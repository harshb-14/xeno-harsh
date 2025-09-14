import { prisma } from '../utils/prisma';

// Find tenant by email
export const findTenantByEmail = async (email: string) => {
  return prisma.tenant.findUnique({ 
    where: { email } 
  });
};

// Create new tenant
export const createTenant = async (data: {
  name: string;
  email: string;
  password: string;
  shopifyUrl: string;
  accessToken: string;
}) => {
  return prisma.tenant.create({ data });
};

// Get all tenants (for sync operations)
export const getAllTenants = async () => {
  return prisma.tenant.findMany({
    select: { 
      id: true, 
      name: true, 
      shopifyUrl: true, 
      accessToken: true 
    }
  });
};