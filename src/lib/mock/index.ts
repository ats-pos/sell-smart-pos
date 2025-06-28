import { mockAuthHandlers } from './handlers/authHandlers';
import { mockDataHandlers } from './handlers/dataHandlers';

// Mock GraphQL client that mimics Apollo Client interface
export class MockGraphQLClient {
  async query({ query, variables }: { query: any; variables?: any }) {
    const operationName = this.extractOperationName(query);
    
    // Route to appropriate handler based on operation name
    switch (operationName) {
      // Auth queries
      case 'GetDeviceUsers':
        return { data: await mockAuthHandlers.getDeviceUsers(variables?.deviceId) };
      case 'CheckStoreExists':
        return { data: await mockAuthHandlers.checkStoreExists(variables?.deviceId) };
      
      // Data queries
      case 'GetProducts':
        return { data: await mockDataHandlers.getProducts(variables) };
      case 'GetProduct':
        return { data: await mockDataHandlers.getProduct(variables) };
      case 'SearchProducts':
        return { data: await mockDataHandlers.searchProducts(variables) };
      case 'GetCustomers':
        return { data: await mockDataHandlers.getCustomers(variables) };
      case 'GetSales':
        return { data: await mockDataHandlers.getSales(variables) };
      case 'GetBarcodes':
        return { data: await mockDataHandlers.getBarcodes(variables) };
      case 'GetStoreProfile':
        return { data: await mockDataHandlers.getStoreProfile() };
      case 'GetDashboardStats':
        return { data: await mockDataHandlers.getDashboardStats() };
      case 'GetLowStockItems':
        return { data: await mockDataHandlers.getLowStockItems() };
      case 'GetRecentTransactions':
        return { data: await mockDataHandlers.getRecentTransactions(variables) };
      case 'GetSalesAnalytics':
        return { data: await mockDataHandlers.getSalesAnalytics(variables) };
      case 'GetTopProducts':
        return { data: await mockDataHandlers.getTopProducts(variables) };
      case 'GetGSTSummary':
        return { data: await mockDataHandlers.getGSTSummary(variables) };
      
      default:
        throw new Error(`Mock handler not implemented for query: ${operationName}`);
    }
  }

  async mutate({ mutation, variables }: { mutation: any; variables?: any }) {
    const operationName = this.extractOperationName(mutation);
    
    // Route to appropriate handler based on operation name
    switch (operationName) {
      // Auth mutations
      case 'LoginUser':
        return { data: await mockAuthHandlers.loginUser(variables?.input) };
      case 'LoginWithOTP':
        return { data: await mockAuthHandlers.loginWithOTP(variables?.input) };
      case 'LoginWithPIN':
        return { data: await mockAuthHandlers.loginWithPIN(variables?.input) };
      case 'SendOTP':
        return { data: await mockAuthHandlers.sendOTP(variables?.phone) };
      case 'RegisterStore':
        return { data: await mockAuthHandlers.registerStore(variables?.input) };
      case 'ForgotPassword':
        return { data: await mockAuthHandlers.forgotPassword(variables?.email) };
      case 'VerifyBiometric':
        return { data: await mockAuthHandlers.verifyBiometric(variables?.input) };
      
      // Data mutations
      case 'CreateProduct':
        return { data: await mockDataHandlers.createProduct(variables) };
      case 'UpdateProduct':
        return { data: await mockDataHandlers.updateProduct(variables) };
      case 'DeleteProduct':
        return { data: await mockDataHandlers.deleteProduct(variables) };
      case 'CreateCustomer':
        return { data: await mockDataHandlers.createCustomer(variables) };
      case 'CreateSale':
        return { data: await mockDataHandlers.createSale(variables) };
      case 'CreateBarcode':
        return { data: await mockDataHandlers.createBarcode(variables) };
      case 'DeleteBarcode':
        return { data: await mockDataHandlers.deleteBarcode(variables) };
      case 'UpdateStoreProfile':
        return { data: await mockDataHandlers.updateStoreProfile(variables) };
      
      default:
        throw new Error(`Mock handler not implemented for mutation: ${operationName}`);
    }
  }

  private extractOperationName(query: any): string {
    // Extract operation name from GraphQL query/mutation
    const queryString = query.loc?.source?.body || query.toString();
    const match = queryString.match(/(?:query|mutation)\s+(\w+)/);
    return match ? match[1] : 'Unknown';
  }

  // Mock methods to match Apollo Client interface
  refetchQueries() {
    return Promise.resolve();
  }

  clearStore() {
    return Promise.resolve();
  }
}

export const mockClient = new MockGraphQLClient();