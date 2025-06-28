import { DashboardStats, SalesAnalytics, TopProduct, GSTSummary } from '@/lib/graphql/types';

export const mockDashboardStats: DashboardStats = {
  sales: 15420,
  transactions: 47,
  customers: 32,
  avgOrder: 328
};

export const mockSalesAnalytics: SalesAnalytics = {
  today: {
    sales: 15420,
    transactions: 47,
    customers: 32
  },
  week: {
    sales: 89340,
    transactions: 234,
    customers: 156
  },
  month: {
    sales: 342580,
    transactions: 1023,
    customers: 567
  }
};

export const mockTopProducts: TopProduct[] = [
  {
    name: 'Wireless Bluetooth Headphones',
    sold: 45,
    revenue: 134955
  },
  {
    name: 'Smartphone Power Bank 10000mAh',
    sold: 38,
    revenue: 56962
  },
  {
    name: 'Bluetooth Speaker',
    sold: 23,
    revenue: 80477
  },
  {
    name: 'USB-C Fast Charging Cable',
    sold: 67,
    revenue: 40133
  },
  {
    name: 'Wireless Mouse',
    sold: 34,
    revenue: 30566
  },
  {
    name: 'Phone Case - Clear',
    sold: 89,
    revenue: 26611
  },
  {
    name: 'Laptop Stand Adjustable',
    sold: 19,
    revenue: 24681
  },
  {
    name: 'Webcam HD 1080p',
    sold: 15,
    revenue: 32985
  }
];

export const mockGSTSummary: GSTSummary = {
  totalSales: 342580,
  cgst: 30832,
  sgst: 30832,
  igst: 0,
  totalGst: 61664
};