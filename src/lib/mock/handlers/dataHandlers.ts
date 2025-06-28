import { mockProducts } from '../data/products';
import { mockCustomers } from '../data/customers';
import { mockSales } from '../data/sales';
import { mockBarcodes } from '../data/barcodes';
import { mockStoreProfile } from '../data/stores';
import { mockDashboardStats, mockSalesAnalytics, mockTopProducts, mockGSTSummary } from '../data/analytics';
import { ProductInput, CustomerInput, SaleInput, BarcodeInput, StoreProfileInput } from '@/lib/graphql/types';

// Mock data handlers
export const mockDataHandlers = {
  // Products
  getProducts: async (variables?: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let products = [...mockProducts];
    
    if (variables?.search) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(variables.search.toLowerCase()) ||
        p.barcode.includes(variables.search) ||
        p.brand.toLowerCase().includes(variables.search.toLowerCase())
      );
    }
    
    if (variables?.category) {
      products = products.filter(p => p.category === variables.category);
    }
    
    const limit = variables?.limit || 50;
    const offset = variables?.offset || 0;
    
    return {
      products: products.slice(offset, offset + limit)
    };
  },

  getProduct: async (variables: { id: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const product = mockProducts.find(p => p.id === variables.id);
    if (!product) throw new Error('Product not found');
    
    return { product };
  },

  searchProducts: async (variables: { query: string }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const products = mockProducts.filter(p =>
      p.name.toLowerCase().includes(variables.query.toLowerCase()) ||
      p.barcode.includes(variables.query) ||
      p.brand.toLowerCase().includes(variables.query.toLowerCase())
    );
    
    return { searchProducts: products };
  },

  createProduct: async (variables: { input: ProductInput }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newProduct = {
      id: `prod-${Date.now()}`,
      ...variables.input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockProducts.push(newProduct);
    
    return { createProduct: newProduct };
  },

  updateProduct: async (variables: { id: string; input: ProductInput }) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = mockProducts.findIndex(p => p.id === variables.id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...variables.input,
      updatedAt: new Date().toISOString()
    };
    
    return { updateProduct: mockProducts[index] };
  },

  deleteProduct: async (variables: { id: string }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = mockProducts.findIndex(p => p.id === variables.id);
    if (index === -1) throw new Error('Product not found');
    
    mockProducts.splice(index, 1);
    
    return {
      deleteProduct: {
        success: true,
        message: 'Product deleted successfully'
      }
    };
  },

  // Customers
  getCustomers: async (variables?: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let customers = [...mockCustomers];
    
    if (variables?.search) {
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(variables.search.toLowerCase()) ||
        c.phone.includes(variables.search) ||
        c.email.toLowerCase().includes(variables.search.toLowerCase())
      );
    }
    
    const limit = variables?.limit || 50;
    const offset = variables?.offset || 0;
    
    return {
      customers: customers.slice(offset, offset + limit)
    };
  },

  createCustomer: async (variables: { input: CustomerInput }) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newCustomer = {
      id: `cust-${Date.now()}`,
      ...variables.input,
      createdAt: new Date().toISOString()
    };
    
    mockCustomers.push(newCustomer);
    
    return { createCustomer: newCustomer };
  },

  // Sales
  getSales: async (variables?: any) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let sales = [...mockSales];
    
    if (variables?.startDate || variables?.endDate) {
      // Filter by date range if provided
      sales = sales.filter(sale => {
        const saleDate = new Date(sale.createdAt);
        const start = variables?.startDate ? new Date(variables.startDate) : new Date(0);
        const end = variables?.endDate ? new Date(variables.endDate) : new Date();
        return saleDate >= start && saleDate <= end;
      });
    }
    
    const limit = variables?.limit || 50;
    const offset = variables?.offset || 0;
    
    return {
      sales: sales.slice(offset, offset + limit)
    };
  },

  createSale: async (variables: { input: SaleInput }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newSale = {
      id: `sale-${Date.now()}`,
      ...variables.input,
      createdAt: new Date().toISOString()
    };
    
    mockSales.unshift(newSale);
    
    return { createSale: newSale };
  },

  // Barcodes
  getBarcodes: async (variables?: any) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const limit = variables?.limit || 50;
    const offset = variables?.offset || 0;
    
    return {
      barcodes: mockBarcodes.slice(offset, offset + limit)
    };
  },

  createBarcode: async (variables: { input: BarcodeInput }) => {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newBarcode = {
      id: `barcode-${Date.now()}`,
      ...variables.input,
      createdAt: new Date().toISOString()
    };
    
    mockBarcodes.push(newBarcode);
    
    return { createBarcode: newBarcode };
  },

  deleteBarcode: async (variables: { id: string }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockBarcodes.findIndex(b => b.id === variables.id);
    if (index === -1) throw new Error('Barcode not found');
    
    mockBarcodes.splice(index, 1);
    
    return {
      deleteBarcode: {
        success: true,
        message: 'Barcode deleted successfully'
      }
    };
  },

  // Store Profile
  getStoreProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { storeProfile: mockStoreProfile };
  },

  updateStoreProfile: async (variables: { input: StoreProfileInput }) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    Object.assign(mockStoreProfile, variables.input);
    
    return { updateStoreProfile: mockStoreProfile };
  },

  // Analytics
  getDashboardStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { dashboardStats: mockDashboardStats };
  },

  getLowStockItems: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowStockItems = mockProducts.filter(p => p.stock <= p.minStock);
    
    return { lowStockItems };
  },

  getRecentTransactions: async (variables?: { limit?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const limit = variables?.limit || 5;
    
    return {
      recentTransactions: mockSales.slice(0, limit)
    };
  },

  getSalesAnalytics: async (variables: { period: string }) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return { salesAnalytics: mockSalesAnalytics };
  },

  getTopProducts: async (variables: { limit: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      topProducts: mockTopProducts.slice(0, variables.limit)
    };
  },

  getGSTSummary: async (variables?: { month?: string; year?: string }) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return { gstSummary: mockGSTSummary };
  }
};