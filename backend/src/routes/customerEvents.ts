import express from 'express'
import { getCustomerEvents, createCustomerEvent, getCustomerEventStats } from '../database/customerEventQueries'
import { authenticateToken } from '../middleware/auth'
import { asyncHandler, AppError } from '../utils/asyncHandler'

const router = express.Router()

// GET /api/customer-events - Fetch customer events for the authenticated tenant
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const tenantId = req.tenantId
  
  if (!tenantId) {
    throw new AppError('Tenant ID not found', 401)
  }

  const { 
    type,
    limit = '50',
    offset = '0',
    startDate,
    endDate
  } = req.query

  const filters = {
    type: type as string,
    limit: parseInt(limit as string, 10),
    offset: parseInt(offset as string, 10),
    startDate: startDate as string,
    endDate: endDate as string
  }

  const events = await getCustomerEvents(tenantId, filters)
  res.json(events)
}))

// POST /api/customer-events - Create a new customer event (for testing or manual events)
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const tenantId = req.tenantId
  
  if (!tenantId) {
    throw new AppError('Tenant ID not found', 401)
  }

  const { 
    type, 
    customerEmail, 
    customerName, 
    shopifyCustomerId, 
    value, 
    products,
    metadata 
  } = req.body

  if (!type) {
    throw new AppError('Event type is required', 400)
  }

  const eventData = {
    type,
    customerEmail,
    customerName,
    shopifyCustomerId,
    value: value ? parseFloat(value) : null,
    products,
    metadata,
    tenantId
  }

  const event = await createCustomerEvent(eventData)
  res.json(event)
}))

// GET /api/customer-events/stats - Get aggregated statistics for customer events
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const tenantId = req.tenantId
  
  if (!tenantId) {
    throw new AppError('Tenant ID not found', 401)
  }

  const { startDate, endDate } = req.query

  const stats = await getCustomerEventStats(tenantId, {
    startDate: startDate as string,
    endDate: endDate as string
  })
  
  res.json(stats)
}))

export default router