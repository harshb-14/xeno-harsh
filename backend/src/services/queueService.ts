import { shopifySyncQueue } from '../queue/index';

// Create a new sync job
export const createSyncJob = async (tenantId: string) => {
  return shopifySyncQueue.add('shopify-sync', {
    tenantId,
    type: 'full-sync',
    startedAt: new Date(),
  }, {
    priority: 1,
    delay: 0,
  });
};

// Get sync job by ID
export const getSyncJob = async (jobId: string) => {
  return shopifySyncQueue.getJob(jobId);
};

// Format job status for API response
export const formatJobStatus = async (job: any) => {
  const state = await job.getState();
  return {
    jobId: job.id,
    status: state,
    progress: job.progress(),
    result: job.returnvalue,
    createdAt: job.timestamp,
    processedAt: job.processedOn,
    finishedAt: job.finishedOn,
  };
};