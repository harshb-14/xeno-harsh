import { 
  countOrders, 
  getTotalRevenue,
  getOrdersByDateRange,
  getRecentOrders
} from '../database/orderQueries';
import { countCustomers, getTopCustomers } from '../database/customerQueries';
import { countProducts } from '../database/productQueries';

// Get dashboard statistics
export const getDashboardStats = async (tenantId: string) => {
  const [customers, orders, products, revenue] = await Promise.all([
    countCustomers(tenantId),
    countOrders(tenantId),
    countProducts(tenantId),
    getTotalRevenue(tenantId)
  ]);

  return {
    customers,
    orders,
    products,
    revenue: revenue._sum.totalPrice || 0
  };
};

// Get orders grouped by date
export const getOrdersByDate = async (tenantId: string, startDate?: string, endDate?: string) => {
  const orders = await getOrdersByDateRange(tenantId, startDate, endDate);
  
  // Group orders by date
  const grouped = orders.reduce((acc, order) => {
    if (!order.shopifyCreatedAt) return acc;
    
    const date = order.shopifyCreatedAt.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, count: 0, revenue: 0 };
    }
    acc[date].count += 1;
    acc[date].revenue += order.totalPrice;
    return acc;
  }, {} as Record<string, any>);
  
  return Object.values(grouped);
};

// Get top performing customers
export const getTopPerformingCustomers = async (tenantId: string) => {
  return getTopCustomers(tenantId, 5);
};

// Get latest orders
export const getLatestOrders = async (tenantId: string) => {
  return getRecentOrders(tenantId, 10);
};