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

  // Add other Apollo Client methods as needed
  watchQuery(options: any) {
    // For mock mode, we'll simulate a simple observable
    return {
      subscribe: (observer: any) => {
        this.query(options).then(result => {
          observer.next(result);
        }).catch(error => {
          observer.error(error);
        });
        
        return {
          unsubscribe: () => {}
        };
      }
    };
  }
}

// Export the appropriate client based on configuration
const apolloClient = isMockMode() 
  ? new MockApolloClientWrapper() as any
  : realApolloClient;

export default apolloClient;