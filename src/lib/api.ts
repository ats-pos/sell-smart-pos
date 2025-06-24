const API_BASE_URL = 'http://api.indyzai.com/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Product {
  id: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  brand: string;
  supplier: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address?: string;
  createdAt?: string;
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: number;
  billNumber: string;
  customerId?: number;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface BarcodeData {
  id: number;
  productName: string;
  sku: string;
  price: number;
  barcode: string;
  barcodeType: string;
  brand: string;
  createdAt?: string;
}

export interface StoreProfile {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  showOnReceipt: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Products API
  async getProducts(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/products');
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: number, product: Partial<Product>): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Sales API
  async getSales(): Promise<ApiResponse<Sale[]>> {
    return this.request<Sale[]>('/sales');
  }

  async getSale(id: number): Promise<ApiResponse<Sale>> {
    return this.request<Sale>(`/sales/${id}`);
  }

  async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<ApiResponse<Sale>> {
    return this.request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(sale),
    });
  }

  async updateSale(id: number, sale: Partial<Sale>): Promise<ApiResponse<Sale>> {
    return this.request<Sale>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sale),
    });
  }

  async getSalesReport(startDate?: string, endDate?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request<any>(`/sales/report?${params.toString()}`);
  }

  // Customers API
  async getCustomers(): Promise<ApiResponse<Customer[]>> {
    return this.request<Customer[]>('/customers');
  }

  async getCustomer(id: number): Promise<ApiResponse<Customer>> {
    return this.request<Customer>(`/customers/${id}`);
  }

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<ApiResponse<Customer>> {
    return this.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer),
    });
  }

  async updateCustomer(id: number, customer: Partial<Customer>): Promise<ApiResponse<Customer>> {
    return this.request<Customer>(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customer),
    });
  }

  async deleteCustomer(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Barcodes API
  async getBarcodes(): Promise<ApiResponse<BarcodeData[]>> {
    return this.request<BarcodeData[]>('/barcodes');
  }

  async createBarcode(barcode: Omit<BarcodeData, 'id'>): Promise<ApiResponse<BarcodeData>> {
    return this.request<BarcodeData>('/barcodes', {
      method: 'POST',
      body: JSON.stringify(barcode),
    });
  }

  async deleteBarcode(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/barcodes/${id}`, {
      method: 'DELETE',
    });
  }

  // Store Profile API
  async getStoreProfile(): Promise<ApiResponse<StoreProfile>> {
    return this.request<StoreProfile>('/store/profile');
  }

  async updateStoreProfile(profile: Partial<StoreProfile>): Promise<ApiResponse<StoreProfile>> {
    return this.request<StoreProfile>('/store/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  }

  // Dashboard API
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/dashboard/stats');
  }

  async getLowStockItems(): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>('/dashboard/low-stock');
  }

  async getRecentTransactions(): Promise<ApiResponse<Sale[]>> {
    return this.request<Sale[]>('/dashboard/recent-transactions');
  }

  // Reports API
  async getSalesAnalytics(period: 'today' | 'week' | 'month'): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/sales?period=${period}`);
  }

  async getTopProducts(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/reports/top-products?limit=${limit}`);
  }

  async getGSTSummary(month?: string, year?: string): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    
    return this.request<any>(`/reports/gst?${params.toString()}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;