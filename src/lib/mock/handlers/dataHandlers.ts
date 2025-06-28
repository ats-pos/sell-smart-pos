
import { 
  mockProducts, 
  mockSales, 
  mockCustomers, 
  mockBarcodes,
  mockSalesAnalytics,
  mockDashboardStats,
  mockTopProducts,
  mockGSTSummary,
  mockStoreProfile
} from '../data';
import type { 
  Product, 
  Sale, 
  Customer, 
  BarcodeData, 
  ProductInput, 
  SaleInput,
  SaleItem,
  SaleItemInput
} from '../../../lib/graphql/types';

let products = [...mockProducts];
let sales = [...mockSales];
let customers = [...mockCustomers];
let barcodes = [...mockBarcodes];

// Helper function to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockDataHandlers = {
  // Product handlers
  async getProducts(variables?: any) {
    return { products };
  },

  async getProduct(variables: { id: string }) {
    const product = products.find(p => p.id === variables.id);
    return { product };
  },

  async searchProducts(variables: { query: string }) {
    const query = variables.query.toLowerCase();
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.barcode.includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    return { products: filteredProducts };
  },

  async createProduct(variables: { input: ProductInput }) {
    const { input } = variables;
    
    const newProduct: Product = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...input
    };
    
    products.unshift(newProduct);
    return { createProduct: newProduct };
  },

  async updateProduct(variables: { id: string, input: ProductInput }) {
    const { id, input } = variables;
    
    products = products.map(product => product.id === id ? { ...product, ...input } : product);
    return { updateProduct: products.find(product => product.id === id) };
  },

  async deleteProduct(variables: { id: string }) {
    const { id } = variables;
    
    products = products.filter(product => product.id !== id);
    return { deleteProduct: id };
  },

  // Customer handlers
  async getCustomers(variables?: any) {
    return { customers };
  },

  async createCustomer(variables: { input: Customer }) {
    const { input } = variables;
    
    const newCustomer: Customer = {
      id: generateId(),
      ...input
    };
    
    customers.unshift(newCustomer);
    return { createCustomer: newCustomer };
  },

  // Sales handlers
  async getSales(variables?: any) {
    return { sales: sales.map(sale => ({
      ...sale,
      items: sale.items.map(item => ({
        ...item,
        id: item.id || generateId()
      }))
    })) };
  },

  async createSale(variables: { input: SaleInput }) {
    const { input } = variables;
    
    const newSale: Sale = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      billNumber: `BILL-${Date.now()}`,
      customerId: input.customerId,
      customerName: input.customerName,
      items: input.items.map((item: SaleItemInput): SaleItem => ({
        ...item,
        id: generateId()
      })),
      subtotal: input.subtotal,
      discount: input.discount || 0,
      gst: input.gst || 0,
      total: input.total,
      paymentMethod: input.paymentMethod,
      status: input.status || 'completed'
    };
    
    sales.unshift(newSale);
    return { createSale: newSale };
  },

  // Barcode handlers
  async getBarcodes(variables?: any) {
    return { barcodes };
  },

  async createBarcode(variables: { input: BarcodeData }) {
    const { input } = variables;
    
    const newBarcode: BarcodeData = {
      id: generateId(),
      ...input
    };
    
    barcodes.unshift(newBarcode);
    return { createBarcode: newBarcode };
  },

  async deleteBarcode(variables: { id: string }) {
    const { id } = variables;
    
    barcodes = barcodes.filter(barcode => barcode.id !== id);
    return { deleteBarcode: id };
  },

  // Analytics and dashboard handlers
  async getDashboardStats() {
    return mockDashboardStats;
  },

  async getLowStockItems() {
    const lowStockItems = products.filter(p => p.stock <= p.minStock);
    return { lowStockItems };
  },

  async getRecentTransactions(variables?: any) {
    const recentSales = sales.slice(0, 10);
    return { recentTransactions: recentSales };
  },

  async getSalesAnalytics(variables?: any) {
    return mockSalesAnalytics;
  },

  async getTopProducts(variables?: any) {
    return { topProducts: mockTopProducts };
  },

  async getGSTSummary(variables?: any) {
    return mockGSTSummary;
  },

  async getStoreProfile() {
    return { storeProfile: mockStoreProfile };
  },

  async updateStoreProfile(variables: { input: any }) {
    return { updateStoreProfile: { ...mockStoreProfile, ...variables.input } };
  }
};
