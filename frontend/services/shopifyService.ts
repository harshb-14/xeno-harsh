import { apiClient } from './apiClient'

export class ShopifyService {
  static async syncData(): Promise<{ jobId: string; status: string; message: string }> {
    const response = await apiClient.post('/api/shopify/sync', {})
    return response.data
  }

  static async getSyncStatus(jobId: string): Promise<any> {
    const response = await apiClient.get(`/api/shopify/sync/status/${jobId}`)
    return response.data
  }
}