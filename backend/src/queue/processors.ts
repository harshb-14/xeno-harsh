import { Job } from 'bull';
import axios from 'axios';
import { prisma } from '../utils/prisma';

export const processShopifySync = async (job: Job) => {
  console.log(`Starting Shopify sync for tenant: ${job.data.tenantId}`);
  
  try {
    const { tenantId } = job.data;
    await job.progress(0);
    
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId }
    });

    if (!tenant) {
      throw new Error(`Tenant ${tenantId} not found`);
    }

    const shopifyBaseUrl = `https://${tenant.shopifyUrl}/admin/api/2025-07`;
    const headers = {
      'X-Shopify-Access-Token': tenant.accessToken,
      'Content-Type': 'application/json'
    };

    // Sync Customers
    console.log(`Syncing customers for ${tenant.name}...`);
    await job.progress(10);
    
    const customersResponse = await axios.get(`${shopifyBaseUrl}/customers.json`, { headers });
    let customersUpdated = 0;
    
    for (const customer of customersResponse.data.customers) {
      await prisma.customer.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId,
            shopifyId: customer.id.toString()
          }
        },
        update: {
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          totalSpent: parseFloat(customer.total_spent || '0'),
          ordersCount: customer.orders_count || 0,
          shopifyCreatedAt: customer.created_at ? new Date(customer.created_at) : null
        },
        create: {
          tenantId,
          shopifyId: customer.id.toString(),
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
          phone: customer.phone,
          totalSpent: parseFloat(customer.total_spent || '0'),
          ordersCount: customer.orders_count || 0,
          shopifyCreatedAt: customer.created_at ? new Date(customer.created_at) : null
        }
      });
      customersUpdated++;
    }
    
    await job.progress(33);
    
    // Sync Products
    console.log(`Syncing products for ${tenant.name}...`);
    
    const productsResponse = await axios.get(`${shopifyBaseUrl}/products.json`, { headers });
    let productsUpdated = 0;
    
    for (const product of productsResponse.data.products) {
      await prisma.product.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId,
            shopifyId: product.id.toString()
          }
        },
        update: {
          title: product.title,
          handle: product.handle,
          productType: product.product_type,
          vendor: product.vendor,
          status: product.status,
          shopifyCreatedAt: product.created_at ? new Date(product.created_at) : null
        },
        create: {
          tenantId,
          shopifyId: product.id.toString(),
          title: product.title,
          handle: product.handle,
          productType: product.product_type,
          vendor: product.vendor,
          status: product.status,
          shopifyCreatedAt: product.created_at ? new Date(product.created_at) : null
        }
      });
      productsUpdated++;
    }
    
    await job.progress(66);
    
    // Sync Orders
    console.log(`Syncing orders for ${tenant.name}...`);
    
    const ordersResponse = await axios.get(`${shopifyBaseUrl}/orders.json`, { headers });
    let ordersUpdated = 0;
    
    for (const order of ordersResponse.data.orders) {
      let customerId = null;
      if (order.customer?.id) {
        const customer = await prisma.customer.findUnique({
          where: {
            tenantId_shopifyId: {
              tenantId,
              shopifyId: order.customer.id.toString()
            }
          }
        });
        customerId = customer?.id || null;
      }

      await prisma.order.upsert({
        where: {
          tenantId_shopifyId: {
            tenantId,
            shopifyId: order.id.toString()
          }
        },
        update: {
          orderNumber: order.order_number?.toString(),
          email: order.email,
          totalPrice: parseFloat(order.total_price || '0'),
          subtotalPrice: parseFloat(order.subtotal_price || '0'),
          taxPrice: parseFloat(order.total_tax || '0'),
          shippingPrice: parseFloat(order.total_shipping_price_set?.shop_money?.amount || '0'),
          financialStatus: order.financial_status,
          fulfillmentStatus: order.fulfillment_status,
          customerId,
          shopifyCreatedAt: order.created_at ? new Date(order.created_at) : null
        },
        create: {
          tenantId,
          shopifyId: order.id.toString(),
          orderNumber: order.order_number?.toString(),
          email: order.email,
          totalPrice: parseFloat(order.total_price || '0'),
          subtotalPrice: parseFloat(order.subtotal_price || '0'),
          taxPrice: parseFloat(order.total_tax || '0'),
          shippingPrice: parseFloat(order.total_shipping_price_set?.shop_money?.amount || '0'),
          financialStatus: order.financial_status,
          fulfillmentStatus: order.fulfillment_status,
          customerId,
          shopifyCreatedAt: order.created_at ? new Date(order.created_at) : null
        }
      });
      ordersUpdated++;
    }
    
    await job.progress(100);
    
    const result = {
      success: true,
      tenantId,
      tenantName: tenant.name,
      customersUpdated,
      productsUpdated,
      ordersUpdated,
      completedAt: new Date()
    };
    
    console.log(`Sync completed for ${tenant.name}:`, result);
    return result;
    
  } catch (error: any) {
    console.error(`Sync failed for tenant ${job.data.tenantId}:`, error.message);
    throw new Error(`Shopify sync failed: ${error.message}`);
  }
};
