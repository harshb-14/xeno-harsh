import { prisma } from '../utils/prisma';

// Count customers for tenant
export const countCustomers = async (tenantId: string) => {
  return prisma.customer.count({ where: { tenantId } });
};

// Get top customers by spending
export const getTopCustomers = async (tenantId: string, limit: number = 5) => {
  return prisma.customer.findMany({
    where: { tenantId },
    orderBy: { totalSpent: 'desc' },
    take: limit,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      totalSpent: true,
      ordersCount: true
    }
  });
};

// Create or update customer from Shopify data
export const upsertCustomer = async (tenantId: string, customerData: any) => {
  return prisma.customer.upsert({
    where: {
      tenantId_shopifyId: {
        tenantId,
        shopifyId: customerData.id.toString()
      }
    },
    update: {
      email: customerData.email,
      firstName: customerData.first_name,
      lastName: customerData.last_name,
      phone: customerData.phone,
      totalSpent: parseFloat(customerData.total_spent || '0'),
      ordersCount: customerData.orders_count || 0,
      shopifyCreatedAt: customerData.created_at ? new Date(customerData.created_at) : null
    },
    create: {
      tenantId,
      shopifyId: customerData.id.toString(),
      email: customerData.email,
      firstName: customerData.first_name,
      lastName: customerData.last_name,
      phone: customerData.phone,
      totalSpent: parseFloat(customerData.total_spent || '0'),
      ordersCount: customerData.orders_count || 0,
      shopifyCreatedAt: customerData.created_at ? new Date(customerData.created_at) : null
    }
  });
};