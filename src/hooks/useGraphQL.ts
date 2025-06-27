import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { useToast } from '@/hooks/use-toast';

export function useGraphQLQuery<T = any>(
  query: any,
  options: {
    variables?: any;
    skip?: boolean;
    pollInterval?: number;
    fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
  } = {}
) {
  const { toast } = useToast();
  
  const result = useQuery<T>(query, {
    ...options,
    onError: (error) => {
      console.error('GraphQL Query Error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive",
      });
    },
  });

  return {
    data: result.data,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
    fetchMore: result.fetchMore,
  };
}

export function useGraphQLMutation<T = any, V = any>(
  mutation: any,
  options: {
    onCompleted?: (data: T) => void;
    onError?: (error: any) => void;
    refetchQueries?: any[];
    awaitRefetchQueries?: boolean;
  } = {}
) {
  const { toast } = useToast();
  const client = useApolloClient();

  const [mutate, result] = useMutation<T, V>(mutation, {
    ...options,
    onCompleted: (data) => {
      options.onCompleted?.(data);
    },
    onError: (error) => {
      console.error('GraphQL Mutation Error:', error);
      toast({
        title: "Error",
        description: error.message || "Operation failed",
        variant: "destructive",
      });
      options.onError?.(error);
    },
  });

  const mutateWithToast = async (variables: V, successMessage?: string) => {
    try {
      const result = await mutate({ variables });
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      return result;
    } catch (error) {
      // Error is already handled by onError
      throw error;
    }
  };

  return {
    mutate: mutateWithToast,
    loading: result.loading,
    error: result.error,
    data: result.data,
    reset: result.reset,
  };
}

export function useRefreshCache() {
  const client = useApolloClient();

  const refreshCache = (queries?: string[]) => {
    if (queries) {
      queries.forEach(query => {
        client.refetchQueries({
          include: [query],
        });
      });
    } else {
      client.refetchQueries({
        include: 'active',
      });
    }
  };

  const clearCache = () => {
    client.clearStore();
  };

  return { refreshCache, clearCache };
}