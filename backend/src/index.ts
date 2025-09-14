import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './utils/prisma';

// Export prisma for backward compatibility
export { prisma };

// Routes
import authRoutes from './routes/auth';
import shopifyRoutes from './routes/shopify';
import dashboardRoutes from './routes/dashboard';
import syncRoutes from './routes/sync';
import customerEventRoutes from './routes/customerEvents';
import webhookRoutes from './routes/webhooks';

// Initialize queue system
import './queue/index';

// Initialize abandonment detection
import { startAbandonmentDetection } from './services/abandonmentDetectionService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Raw body middleware for webhooks (must come before JSON parser)
app.use('/api/webhooks', express.raw({ type: 'application/json' }));

// JSON middleware for other routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/customer-events', customerEventRoutes);
app.use('/api/webhooks', webhookRoutes);

// Health check
app.get('/health', (_, res) => {
  res.json({ status: 'OK', message: 'Xeno Backend is running!' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start abandonment detection scheduler
  startAbandonmentDetection();
});
