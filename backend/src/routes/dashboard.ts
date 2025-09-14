import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getDashboardStats,
  getOrdersByDate,
  getTopPerformingCustomers,
  getLatestOrders
} from '../services/dashboardService';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Get dashboard statistics
router.get('/stats', authenticateToken, asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.tenantId!);
  res.json(stats);
}));

// Get orders grouped by date
router.get('/orders-by-date', authenticateToken, asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const orders = await getOrdersByDate(req.tenantId!, startDate as string, endDate as string);
  res.json(orders);
}));

// Get top performing customers
router.get('/top-customers', authenticateToken, asyncHandler(async (req, res) => {
  const customers = await getTopPerformingCustomers(req.tenantId!);
  res.json(customers);
}));

// Get recent orders
router.get('/recent-orders', authenticateToken, asyncHandler(async (req, res) => {
  const orders = await getLatestOrders(req.tenantId!);
  res.json(orders);
}));

export default router;
