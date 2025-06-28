import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { config, isMockMode } from '@/lib/config';
import { mockClient } from '@/lib/mock';
import { STORAGE_KEYS, ROUTES } from '@/lib/utils/constants';

// Create HTTP link for real GraphQL endpoint
const httpLink = createHttpLink({
  uri: config.api.graphql,
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Error link for handling GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    if ('status' in networkError) {
      const status = (networkError as any).status;
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        localStorage.removeItem(STORAGE_KEYS.currentUser);
        localStorage.removeItem(STORAGE_KEYS.currentStore);
        window.location.href = ROUTES.login;
      }
    }
  }
});

// Real Apollo Client
const realApolloClient = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});

// Mock Apollo Client wrapper
class MockApolloClientWrapper {
  private mockClient = mockClient;
  public link: any;
  public cache: any;
  public defaultOptions: any = {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  };

  constructor() {
    this.link = {};
    this.cache = new InMemoryCache();
  }

  async query(options: any) {
    return this.mockClient.query(options);
  }

  async mutate(options: any) {
    return this.mockClient.mutate(options);
  }

  refetchQueries(options: any) {
    return this.mockClient.refetchQueries();
  }

  clearStore() {
    return this.mockClient.clearStore();
  }

  // Properly implement watchQuery to return an Observable-like object
  watchQuery(options: any) {
    let currentSubscriber: any = null;
    let currentResult: any = null;
    let isLoading = true;
    let error: any = null;

    // Execute the query immediately
    this.query(options)
      .then(result => {
        currentResult = result;
        isLoading = false;
        error = null;
        if (currentSubscriber) {
          currentSubscriber.next({
            data: result.data,
            loading: false,
            error: null,
            networkStatus: 7, // ready
            stale: false
          });
        }
      })
      .catch(err => {
        error = err;
        isLoading = false;
        if (currentSubscriber) {
          currentSubscriber.error(err);
        }
      });

    return {
      subscribe: (observer: any) => {
        currentSubscriber = observer;
        
        // Immediately emit loading state
        observer.next({
          data: undefined,
          loading: true,
          error: null,
          networkStatus: 1, // loading
          stale: false
        });

        // If we already have a result, emit it
        if (currentResult && !isLoading) {
          observer.next({
            data: currentResult.data,
            loading: false,
            error: null,
            networkStatus: 7, // ready
            stale: false
          });
        }

        // If we have an error, emit it
        if (error && !isLoading) {
          observer.error(error);
        }
        
        return {
          unsubscribe: () => {
            currentSubscriber = null;
          }
        };
      },
      
      // Add other methods that Apollo's watchQuery returns
      refetch: () => {
        isLoading = true;
        if (currentSubscriber) {
          currentSubscriber.next({
            data: currentResult?.data,
            loading: true,
            error: null,
            networkStatus: 4, // refetch
            stale: false
          });
        }
        
        return this.query(options)
          .then(result => {
            currentResult = result;
            isLoading = false;
            if (currentSubscriber) {
              currentSubscriber.next({
                data: result.data,
                loading: false,
                error: null,
                networkStatus: 7, // ready
                stale: false
              });
            }
            return result;
          })
          .catch(err => {
            error = err;
            isLoading = false;
            if (currentSubscriber) {
              currentSubscriber.error(err);
            }
            throw err;
          });
      },
      
      fetchMore: () => Promise.resolve(currentResult),
      updateQuery: () => {},
      startPolling: () => {},
      stopPolling: () => {},
      subscribeToMore: () => () => {}
    };
  }
}

// Export the appropriate client based on configuration
const apolloClient = isMockMode() 
  ? new MockApolloClientWrapper() as any
  : realApolloClient;

export default apolloClient;