import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createSyncJob,
  getSyncJob,
  formatJobStatus
} from '../services/queueService';
import {
  registerWebhooks,
  listWebhooks,
  deleteWebhook
} from '../services/shopifyService';
import { asyncHandler, AppError } from '../utils/asyncHandler';
import { getTenantById } from '../utils/tenantHelper';

const router = express.Router();

// Start Shopify data sync (includes customer events)
router.post('/sync', authenticateToken, asyncHandler(async (req, res) => {
  const job = await createSyncJob(req.tenantId!);

  res.json({
    jobId: job.id,
    status: 'queued',
    message: 'Shopify sync started - includes customer events'
  });
}));

// Check sync job status
router.get('/sync/status/:jobId', authenticateToken, asyncHandler(async (req, res) => {
  const job = await getSyncJob(req.params.jobId);

  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const status = await formatJobStatus(job);
  res.json(status);
}));

// Register webhooks for the current tenant
router.post('/webhooks/register', authenticateToken, asyncHandler(async (req, res) => {
  const tenant = await getTenantById(req.tenantId!);
  const webhookUrl = process.env.WEBHOOK_BASE_URL || `http://localhost:${process.env.PORT || 3001}`;

  const results = await registerWebhooks(tenant.shopifyUrl, tenant.accessToken, webhookUrl);

  res.json({
    message: 'Webhook registration completed',
    results,
    webhookUrl
  });
}));

// List existing webhooks
router.get('/webhooks', authenticateToken, asyncHandler(async (req, res) => {
  const tenant = await getTenantById(req.tenantId!);
  const webhooks = await listWebhooks(tenant.shopifyUrl, tenant.accessToken);

  res.json({
    webhooks,
    count: webhooks.length
  });
}));

// Delete a webhook
router.delete('/webhooks/:webhookId', authenticateToken, asyncHandler(async (req, res) => {
  const tenant = await getTenantById(req.tenantId!);
  await deleteWebhook(tenant.shopifyUrl, tenant.accessToken, req.params.webhookId);

  res.json({
    message: 'Webhook deleted successfully'
  });
}));

export default router;
