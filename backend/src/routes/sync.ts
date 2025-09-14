import express from 'express';
import { syncAllTenants } from '../services/shopifyService';
import { successResponse } from '../helpers/responseHelper';
import { asyncHandler } from '../utils/asyncHandler';

const router = express.Router();

// Auto-sync all tenants (for cron jobs)
router.post('/auto-sync', asyncHandler(async (req, res) => {
  const result = await syncAllTenants();
  res.json(successResponse('Auto-sync completed', result));
}));

export default router;
