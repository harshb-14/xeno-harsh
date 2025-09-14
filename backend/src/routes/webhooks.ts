import express from 'express'
import { verifyShopifyWebhook } from '../utils/webhookVerification'
import { findTenantByShopDomain } from '../utils/tenantHelper'
import { asyncHandler } from '../utils/asyncHandler'
import { logWebhook, createWebhookEvent } from '../utils/webhookHelpers'

const router = express.Router()



// POST /api/webhooks/shopify/carts/update - Handle cart updates for abandonment detection
router.post('/shopify/carts/update', verifyShopifyWebhook, asyncHandler(async (req, res) => {
  console.log('Cart webhook received')
  const cartData = req.body
  const shopDomain = req.get('X-Shopify-Shop-Domain')
  
  if (!shopDomain) {
    return res.status(400).json({ error: 'Missing shop domain' })
  }

  const tenant = await findTenantByShopDomain(shopDomain)
  await logWebhook('shopify', 'carts/update', cartData, tenant.id)

  // Process cart data for potential abandonment
  if (cartData.line_items?.length > 0) {
    await createWebhookEvent('cart_updated', cartData, tenant.id, {
      cartId: cartData.id,
      cartToken: cartData.token,
      updatedAt: cartData.updated_at,
      lineItemsCount: cartData.line_items.length
    })
  }

  res.status(200).json({ status: 'received' })
}))

// POST /api/webhooks/shopify/checkouts/create - Handle checkout started events
router.post('/shopify/checkouts/create', verifyShopifyWebhook, asyncHandler(async (req, res) => {
  console.log('Checkout create webhook received')
  const checkoutData = req.body
  const shopDomain = req.get('X-Shopify-Shop-Domain')
  
  if (!shopDomain) {
    return res.status(400).json({ error: 'Missing shop domain' })
  }

  const tenant = await findTenantByShopDomain(shopDomain)
  await logWebhook('shopify', 'checkouts/create', checkoutData, tenant.id)

  await createWebhookEvent('checkout_started', checkoutData, tenant.id, {
    checkoutId: checkoutData.id,
    checkoutToken: checkoutData.token,
    createdAt: checkoutData.created_at
  })

  res.status(200).json({ status: 'received' })
}))

// POST /api/webhooks/shopify/checkouts/update - Handle checkout updates
router.post('/shopify/checkouts/update', verifyShopifyWebhook, asyncHandler(async (req, res) => {
  console.log('Checkout update webhook received')
  const checkoutData = req.body
  const shopDomain = req.get('X-Shopify-Shop-Domain')
  
  if (!shopDomain) {
    return res.status(400).json({ error: 'Missing shop domain' })
  }

  const tenant = await findTenantByShopDomain(shopDomain)
  await logWebhook('shopify', 'checkouts/update', checkoutData, tenant.id)

  // Checkout abandonment logic handled by scheduled jobs
  res.status(200).json({ status: 'received' })
}))

// POST /api/webhooks/shopify/orders/create - Handle completed orders
router.post('/shopify/orders/create', verifyShopifyWebhook, asyncHandler(async (req, res) => {
  console.log('Order create webhook received')
  const orderData = req.body
  const shopDomain = req.get('X-Shopify-Shop-Domain')
  
  if (!shopDomain) {
    return res.status(400).json({ error: 'Missing shop domain' })
  }

  const tenant = await findTenantByShopDomain(shopDomain)
  await logWebhook('shopify', 'orders/create', orderData, tenant.id)

  await createWebhookEvent('order_placed', orderData, tenant.id, {
    orderId: orderData.id,
    orderNumber: orderData.order_number,
    createdAt: orderData.created_at,
    financialStatus: orderData.financial_status
  })

  res.status(200).json({ status: 'received' })
}))

// GET /api/webhooks/test - Test endpoint to verify webhooks are working
router.get('/test', (_, res) => {
  res.json({ 
    status: 'Webhook endpoints are active',
    endpoints: [
      'POST /api/webhooks/shopify/carts/update',
      'POST /api/webhooks/shopify/checkouts/create',
      'POST /api/webhooks/shopify/checkouts/update',
      'POST /api/webhooks/shopify/orders/create'
    ]
  })
})

export default router