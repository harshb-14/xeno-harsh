import { useState, useCallback } from 'react'
import { handleApiError, handleAsyncError } from '../utils/errorHandler'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export const useApi = <T = any>(initialData: T | null = null) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  })

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const result = await handleAsyncError(async () => {
      const data = await apiCall()
      setState({ data, loading: false, error: null })
      return data
    })

    if (result === undefined) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Operation failed' 
      }))
    }

    return result
  }, [])

  const setError = useCallback((error: any) => {
    setState(prev => ({
      ...prev,
      loading: false,
      error: handleApiError(error)
    }))
  }, [])

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null
    })
  }, [initialData])

  return {
    ...state,
    execute,
    setError,
    reset
  }
}