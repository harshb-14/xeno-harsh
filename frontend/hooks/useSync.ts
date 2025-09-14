import { ShopifyService } from '../services/shopifyService'
import { useApi } from './useApi'

export const useSync = () => {
  const api = useApi()

  const syncData = async (): Promise<boolean> => {
    const result = await api.execute(() => ShopifyService.syncData())
    if (result) {
      console.log('Sync started:', result.message)
      return true
    }
    return false
  }

  return {
    syncing: api.loading,
    error: api.error,
    syncData
  }
}