import { createCustomerEvent } from '../database/customerEventQueries';
import { prisma } from './prisma';

// Log webhook for debugging
export const logWebhook = async (source: string, eventType: string, payload: any, tenantId: string) => {
  return prisma.webhookLog.create({
    data: {
      source,
      eventType,
      payload,
      tenantId
    }
  });
};

// Extract products from line items
export const extractProducts = (lineItems: any[] = []) => {
  return lineItems.map((item: any) => ({
    id: item.product_id,
    title: item.title,
    quantity: item.quantity,
    price: parseFloat(item.price)
  }));
};

// Extract customer name from various sources
export const extractCustomerName = (data: any) => {
  return data.customer?.display_name || 
         `${data.billing_address?.first_name || ''} ${data.billing_address?.last_name || ''}`.trim() ||
         null;
};

// Create customer event with common logic
export const createWebhookEvent = async (
  type: string,
  data: any,
  tenantId: string,
  metadata: any = {}
) => {
  const value = parseFloat(data.total_price || '0');
  const products = extractProducts(data.line_items);
  
  return createCustomerEvent({
    type,
    customerEmail: data.email,
    customerName: extractCustomerName(data),
    shopifyCustomerId: data.customer?.id?.toString(),
    value,
    products,
    metadata,
    tenantId
  });
};