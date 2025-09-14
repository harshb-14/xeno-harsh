import axios from 'axios';
import { getAllTenants } from '../database/tenantQueries';
import { upsertCustomer } from '../database/customerQueries';
import { upsertOrder } from '../database/orderQueries';
import { upsertProduct } from '../database/productQueries';

// Get Shopify API headers
const getShopifyHeaders = (accessToken: string) => ({
  'X-Shopify-Access-Token': accessToken,
  'Content-Type': 'application/json'
});

// Fetch data from Shopify API
export const fetchShopifyData = async (shopifyUrl: string, accessToken: string, endpoint: string) => {
  const url = `https://${shopifyUrl}/admin/api/2025-07/${endpoint}`;
  const headers = getShopifyHeaders(accessToken);
  
  const response = await axios.get(url, { headers });
  return response.data;
};

// Sync customers for a tenant
export const syncCustomersForTenant = async (tenantId: string, shopifyUrl: string, accessToken: string) => {
  const data = await fetchShopifyData(shopifyUrl, accessToken, 'customers.json?limit=10');
  let syncedCount = 0;

  for (const customer of data.customers) {
    await upsertCustomer(tenantId, customer);
    syncedCount++;
  }

  return { syncedCount, type: 'customers' };
};

// Sync orders for a tenant
export const syncOrdersForTenant = async (tenantId: string, shopifyUrl: string, accessToken: string) => {
  const data = await fetchShopifyData(shopifyUrl, accessToken, 'orders.json?limit=10');
  let syncedCount = 0;

  for (const order of data.orders) {
    await upsertOrder(tenantId, order);
    syncedCount++;
  }

  return { syncedCount, type: 'orders' };
};

// Sync products for a tenant
export const syncProductsForTenant = async (tenantId: string, shopifyUrl: string, accessToken: string) => {
  const data = await fetchShopifyData(shopifyUrl, accessToken, 'products.json?limit=10');
  let syncedCount = 0;

  for (const product of data.products) {
    await upsertProduct(tenantId, product);
    syncedCount++;
  }

  return { syncedCount, type: 'products' };
};

// Sync all data for all tenants
export const syncAllTenants = async () => {
  const tenants = await getAllTenants();
  const results = [];

  for (const tenant of tenants) {
    try {
      const customerResult = await syncCustomersForTenant(tenant.id, tenant.shopifyUrl, tenant.accessToken);
      
      results.push({
        tenantName: tenant.name,
        customersUpdated: customerResult.syncedCount,
        status: 'success'
      });
    } catch (error: any) {
      results.push({
        tenantName: tenant.name,
        error: error?.message || 'Sync failed',
        status: 'error'
      });
    }
  }

  return {
    results,
    totalTenants: tenants.length
  };
};

// Register webhooks for a Shopify store
export const registerWebhooks = async (shopifyUrl: string, accessToken: string, webhookUrl: string) => {
  const headers = getShopifyHeaders(accessToken);
  const baseUrl = `https://${shopifyUrl}/admin/api/2025-07/webhooks.json`;
  
  const webhooks = [
    {
      topic: 'carts/update',
      address: `${webhookUrl}/api/webhooks/shopify/carts/update`,
      format: 'json'
    },
    {
      topic: 'checkouts/create',
      address: `${webhookUrl}/api/webhooks/shopify/checkouts/create`,
      format: 'json'
    },
    {
      topic: 'checkouts/update',
      address: `${webhookUrl}/api/webhooks/shopify/checkouts/update`,
      format: 'json'
    },
    {
      topic: 'orders/create',
      address: `${webhookUrl}/api/webhooks/shopify/orders/create`,
      format: 'json'
    }
  ];

  const results = [];
  
  for (const webhook of webhooks) {
    try {
      const response = await axios.post(baseUrl, { webhook }, { headers });
      results.push({
        topic: webhook.topic,
        status: 'success',
        id: response.data.webhook.id,
        address: webhook.address
      });
      console.log(`Registered webhook: ${webhook.topic}`);
    } catch (error: any) {
      // Check if webhook already exists
      if (error.response?.status === 422 && error.response?.data?.errors?.address) {
        results.push({
          topic: webhook.topic,
          status: 'already_exists',
          error: 'Webhook already registered'
        });
        console.log(`Webhook already exists: ${webhook.topic}`);
      } else {
        results.push({
          topic: webhook.topic,
          status: 'error',
          error: error.response?.data || error.message
        });
        console.error(`Failed to register webhook ${webhook.topic}:`, error.response?.data || error.message);
      }
    }
  }
  
  return results;
};

// List existing webhooks for a store
export const listWebhooks = async (shopifyUrl: string, accessToken: string) => {
  const headers = getShopifyHeaders(accessToken);
  const url = `https://${shopifyUrl}/admin/api/2025-07/webhooks.json`;
  
  try {
    const response = await axios.get(url, { headers });
    return response.data.webhooks;
  } catch (error: any) {
    console.error('Failed to list webhooks:', error.response?.data || error.message);
    throw error;
  }
};

// Delete a webhook
export const deleteWebhook = async (shopifyUrl: string, accessToken: string, webhookId: string) => {
  const headers = getShopifyHeaders(accessToken);
  const url = `https://${shopifyUrl}/admin/api/2025-07/webhooks/${webhookId}.json`;
  
  try {
    await axios.delete(url, { headers });
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete webhook:', error.response?.data || error.message);
    throw error;
  }
};