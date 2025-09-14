import cron from 'node-cron'
import { prisma } from '../utils/prisma'
import { createCustomerEvent } from '../database/customerEventQueries'

// Helper function to detect cart abandonment
const detectCartAbandonment = async () => {
  try {
    console.log('Running cart abandonment detection...')
    
    // Look for cart_updated events from the last 24 hours that haven't been followed by an order
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000) // Grace period
    
    const cartUpdates = await prisma.customerEvent.findMany({
      where: {
        type: 'cart_updated',
        createdAt: {
          gte: twentyFourHoursAgo,
          lte: oneHourAgo // Don't check very recent carts
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    let abandonedCartsDetected = 0

    for (const cartEvent of cartUpdates) {
      const metadata = cartEvent.metadata as any
      const cartToken = metadata?.cartToken
      const customerEmail = cartEvent.customerEmail
      const tenantId = cartEvent.tenantId

      if (!cartToken && !customerEmail) continue

      // Check if there's a corresponding order for this cart/customer after the cart update
      const orderAfterCart = await prisma.customerEvent.findFirst({
        where: {
          type: 'order_placed',
          tenantId: tenantId,
          OR: [
            { customerEmail: customerEmail },
            { 
              metadata: {
                path: ['checkoutToken'],
                equals: cartToken
              }
            }
          ],
          createdAt: {
            gte: cartEvent.createdAt
          }
        }
      })

      if (!orderAfterCart) {
        // Check if we've already created an abandonment event for this cart
        const existingAbandonment = await prisma.customerEvent.findFirst({
          where: {
            type: 'cart_abandoned',
            tenantId: tenantId,
            metadata: {
              path: ['originalCartToken'],
              equals: cartToken
            }
          }
        })

        if (!existingAbandonment) {
          // Create cart abandonment event
          await createCustomerEvent({
            type: 'cart_abandoned',
            customerEmail: cartEvent.customerEmail || undefined,
            customerName: cartEvent.customerName || undefined,
            shopifyCustomerId: cartEvent.shopifyCustomerId || undefined,
            value: cartEvent.value,
            products: cartEvent.products,
            metadata: {
              ...(metadata || {}),
              originalCartToken: cartToken,
              abandonedAt: new Date().toISOString(),
              detectedBy: 'scheduled_job'
            },
            tenantId: tenantId
          })

          abandonedCartsDetected++
          console.log(`Cart abandoned detected for ${customerEmail || 'unknown customer'} - Value: $${cartEvent.value || 0}`)
        }
      }
    }

    console.log(`Cart abandonment detection completed. Found ${abandonedCartsDetected} new abandonments.`)
  } catch (error) {
    console.error('Error in cart abandonment detection:', error)
  }
}

// Helper function to detect checkout abandonment
const detectCheckoutAbandonment = async () => {
  try {
    console.log('Running checkout abandonment detection...')
    
    // Look for checkout_started events from the last 24 hours that haven't been completed
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000) // Longer grace period for checkouts
    
    const checkoutStarts = await prisma.customerEvent.findMany({
      where: {
        type: 'checkout_started',
        createdAt: {
          gte: twentyFourHoursAgo,
          lte: twoHoursAgo
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    let abandonedCheckoutsDetected = 0

    for (const checkoutEvent of checkoutStarts) {
      const metadata = checkoutEvent.metadata as any
      const checkoutToken = metadata?.checkoutToken
      const customerEmail = checkoutEvent.customerEmail
      const tenantId = checkoutEvent.tenantId

      if (!checkoutToken && !customerEmail) continue

      // Check if there's a corresponding order for this checkout
      const orderAfterCheckout = await prisma.customerEvent.findFirst({
        where: {
          type: 'order_placed',
          tenantId: tenantId,
          OR: [
            { customerEmail: customerEmail },
            {
              metadata: {
                path: ['checkoutToken'],
                equals: checkoutToken
              }
            }
          ],
          createdAt: {
            gte: checkoutEvent.createdAt
          }
        }
      })

      if (!orderAfterCheckout) {
        // Check if we've already created an abandonment event for this checkout
        const existingAbandonment = await prisma.customerEvent.findFirst({
          where: {
            type: 'checkout_abandoned',
            tenantId: tenantId,
            metadata: {
              path: ['originalCheckoutToken'],
              equals: checkoutToken
            }
          }
        })

        if (!existingAbandonment) {
          // Create checkout abandonment event
          await createCustomerEvent({
            type: 'checkout_abandoned',
            customerEmail: checkoutEvent.customerEmail || undefined,
            customerName: checkoutEvent.customerName || undefined,
            shopifyCustomerId: checkoutEvent.shopifyCustomerId || undefined,
            value: checkoutEvent.value,
            products: checkoutEvent.products,
            metadata: {
              ...(metadata || {}),
              originalCheckoutToken: checkoutToken,
              abandonedAt: new Date().toISOString(),
              detectedBy: 'scheduled_job'
            },
            tenantId: tenantId
          })

          abandonedCheckoutsDetected++
          console.log(`Checkout abandoned detected for ${customerEmail || 'unknown customer'} - Value: $${checkoutEvent.value || 0}`)
        }
      }
    }

    console.log(`Checkout abandonment detection completed. Found ${abandonedCheckoutsDetected} new checkout abandonments.`)
  } catch (error) {
    console.error('Error in checkout abandonment detection:', error)
  }
}

// Clean up old webhook logs (keep only last 30 days)
const cleanupWebhookLogs = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    const deleted = await prisma.webhookLog.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo
        }
      }
    })

    if (deleted.count > 0) {
      console.log(`Cleaned up ${deleted.count} old webhook logs`)
    }
  } catch (error) {
    console.error('Error cleaning up webhook logs:', error)
  }
}

// Schedule the abandonment detection to run every hour
export const startAbandonmentDetection = () => {
  console.log('Starting cart abandonment detection scheduler...')
  
  // Run cart abandonment detection every hour
  cron.schedule('0 * * * *', detectCartAbandonment)
  
  // Run checkout abandonment detection every 2 hours
  cron.schedule('0 */2 * * *', detectCheckoutAbandonment)
  
  // Clean up old webhook logs daily at midnight
  cron.schedule('0 0 * * *', cleanupWebhookLogs)
  
  console.log('Scheduled jobs configured:')
  console.log('  - Cart abandonment detection: Every hour')
  console.log('  - Checkout abandonment detection: Every 2 hours')
  console.log('  - Webhook log cleanup: Daily at midnight')
}

// Export functions for manual testing
export { detectCartAbandonment, detectCheckoutAbandonment, cleanupWebhookLogs }