// GraphQL Type Definitions
export interface Product {
  id: string;
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

export interface ProductInput {
  name: string;
  barcode: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  brand: string;
  supplier: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address?: string;
  createdAt?: string;
}

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
  gstin: string;
  address?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  billNumber: string;
  customerId?: string;
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

export interface SaleInput {
  billNumber: string;
  customerId?: string;
  customerName?: string;
  items: SaleItemInput[];
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SaleItemInput {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
}

export interface BarcodeData {
  id: string;
  productName: string;
  sku: string;
  price: number;
  barcode: string;
  barcodeType: string;
  brand: string;
  createdAt?: string;
}

export interface BarcodeInput {
  productName: string;
  sku: string;
  price: number;
  barcode: string;
  barcodeType: string;
  brand: string;
}

export interface StoreProfile {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  showOnReceipt: boolean;
}

export interface StoreProfileInput {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  showOnReceipt: boolean;
}

export interface DashboardStats {
  sales: number;
  transactions: number;
  customers: number;
  avgOrder: number;
}

export interface SalesAnalytics {
  today: {
    sales: number;
    transactions: number;
    customers: number;
  };
  week: {
    sales: number;
    transactions: number;
    customers: number;
  };
  month: {
    sales: number;
    transactions: number;
    customers: number;
  };
}

export interface TopProduct {
  name: string;
  sold: number;
  revenue: number;
}

export interface GSTSummary {
  totalSales: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}