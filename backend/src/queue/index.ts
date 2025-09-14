import Bull from 'bull';
import { processShopifySync } from './processors';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export const shopifySyncQueue = new Bull('shopify-sync', REDIS_URL, {
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

shopifySyncQueue.process('shopify-sync', 2, processShopifySync);

console.log('Shopify Sync Queue initialized');

shopifySyncQueue.on('active', (job) => {
  console.log(`Job ${job.id} started for tenant ${job.data.tenantId}`);
});

shopifySyncQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

shopifySyncQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
});
