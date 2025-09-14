import { prisma } from '../utils/prisma';

// Count orders for tenant
export const countOrders = async (tenantId: string) => {
  return prisma.order.count({ where: { tenantId } });
};

// Get total revenue for tenant
export const getTotalRevenue = async (tenantId: string) => {
  return prisma.order.aggregate({
    where: { tenantId },
    _sum: { totalPrice: true }
  });
};

// Get orders by date range
export const getOrdersByDateRange = async (tenantId: string, startDate?: string, endDate?: string) => {
  const where: any = { tenantId };
  
  if (startDate && endDate) {
    where.shopifyCreatedAt = {
      gte: new Date(startDate),
      lte: new Date(endDate)
    };
  }
  
  return prisma.order.findMany({
    where,
    select: { shopifyCreatedAt: true, totalPrice: true },
    orderBy: { shopifyCreatedAt: 'asc' }
  });
};

// Get recent orders
export const getRecentOrders = async (tenantId: string, limit: number = 10) => {
  return prisma.order.findMany({
    where: { tenantId },
    orderBy: { shopifyCreatedAt: 'desc' },
    take: limit,
    include: {
      customer: {
        select: { firstName: true, lastName: true, email: true }
      }
    }
  });
};

// Create or update order from Shopify data
export const upsertOrder = async (tenantId: string, orderData: any) => {
  return prisma.order.upsert({
    where: {
      tenantId_shopifyId: {
        tenantId,
        shopifyId: orderData.id.toString()
      }
    },
    update: {
      orderNumber: orderData.order_number?.toString(),
      email: orderData.email,
      totalPrice: parseFloat(orderData.total_price || '0'),
      subtotalPrice: parseFloat(orderData.subtotal_price || '0'),
      taxPrice: parseFloat(orderData.total_tax || '0'),
      shippingPrice: parseFloat(orderData.total_shipping_price_set?.shop_money?.amount || '0'),
      financialStatus: orderData.financial_status,
      fulfillmentStatus: orderData.fulfillment_status,
      shopifyCreatedAt: orderData.created_at ? new Date(orderData.created_at) : null
    },
    create: {
      tenantId,
      shopifyId: orderData.id.toString(),
      orderNumber: orderData.order_number?.toString(),
      email: orderData.email,
      totalPrice: parseFloat(orderData.total_price || '0'),
      subtotalPrice: parseFloat(orderData.subtotal_price || '0'),
      taxPrice: parseFloat(orderData.total_tax || '0'),
      shippingPrice: parseFloat(orderData.total_shipping_price_set?.shop_money?.amount || '0'),
      financialStatus: orderData.financial_status,
      fulfillmentStatus: orderData.fulfillment_status,
      shopifyCreatedAt: orderData.created_at ? new Date(orderData.created_at) : null
    }
  });
};