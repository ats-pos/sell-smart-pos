import { useState, useEffect } from 'react';
import { ApiResponse } from '@/lib/api';

export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiCall();
        
        if (isMounted) {
          if (response.success && response.data) {
            setData(response.data);
          } else {
            setError(response.error || 'Failed to fetch data');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    apiCall: (params: P) => Promise<ApiResponse<T>>
  ) => {
    return async (params: P): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiCall(params);
        
        if (response.success && response.data) {
          return response.data;
        } else {
          setError(response.error || 'Operation failed');
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        return null;
      } finally {
        setLoading(false);
      }
    };
  };

  return { mutate, loading, error };
}