import { gql } from '@apollo/client';

// Product Queries
export const GET_PRODUCTS = gql`
  query GetProducts($search: String, $category: String, $limit: Int, $offset: Int) {
    products(search: $search, category: $category, limit: $limit, offset: $offset) {
      id
      name
      barcode
      price
      stock
      minStock
      category
      brand
      supplier
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      barcode
      price
      stock
      minStock
      category
      brand
      supplier
      createdAt
      updatedAt
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($query: String!) {
    searchProducts(query: $query) {
      id
      name
      barcode
      price
      stock
      minStock
      category
      brand
      supplier
    }
  }
`;

// Sales Queries
export const GET_SALES = gql`
  query GetSales($startDate: String, $endDate: String, $limit: Int, $offset: Int) {
    sales(startDate: $startDate, endDate: $endDate, limit: $limit, offset: $offset) {
      id
      billNumber
      customerId
      customerName
      items {
        id
        productId
        productName
        price
        quantity
        discount
        total
      }
      subtotal
      discount
      gst
      total
      paymentMethod
      status
      createdAt
    }
  }
`;

export const GET_SALE = gql`
  query GetSale($id: ID!) {
    sale(id: $id) {
      id
      billNumber
      customerId
      customerName
      items {
        id
        productId
        productName
        price
        quantity
        discount
        total
      }
      subtotal
      discount
      gst
      total
      paymentMethod
      status
      createdAt
    }
  }
`;

// Customer Queries
export const GET_CUSTOMERS = gql`
  query GetCustomers($search: String, $limit: Int, $offset: Int) {
    customers(search: $search, limit: $limit, offset: $offset) {
      id
      name
      phone
      email
      gstin
      address
      createdAt
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      id
      name
      phone
      email
      gstin
      address
      createdAt
    }
  }
`;

// Barcode Queries
export const GET_BARCODES = gql`
  query GetBarcodes($limit: Int, $offset: Int) {
    barcodes(limit: $limit, offset: $offset) {
      id
      productName
      sku
      price
      barcode
      barcodeType
      brand
      createdAt
    }
  }
`;

// Store Profile Queries
export const GET_STORE_PROFILE = gql`
  query GetStoreProfile {
    storeProfile {
      id
      name
      address
      phone
      email
      gstin
      showOnReceipt
    }
  }
`;

// Dashboard Queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      sales
      transactions
      customers
      avgOrder
    }
  }
`;

export const GET_LOW_STOCK_ITEMS = gql`
  query GetLowStockItems {
    lowStockItems {
      id
      name
      stock
      minStock
      category
      brand
    }
  }
`;

export const GET_RECENT_TRANSACTIONS = gql`
  query GetRecentTransactions($limit: Int) {
    recentTransactions(limit: $limit) {
      id
      billNumber
      total
      customerName
      createdAt
    }
  }
`;

// Reports Queries
export const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics($period: String!) {
    salesAnalytics(period: $period) {
      today {
        sales
        transactions
        customers
      }
      week {
        sales
        transactions
        customers
      }
      month {
        sales
        transactions
        customers
      }
    }
  }
`;

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts($limit: Int!) {
    topProducts(limit: $limit) {
      name
      sold
      revenue
    }
  }
`;

export const GET_GST_SUMMARY = gql`
  query GetGSTSummary($month: String, $year: String) {
    gstSummary(month: $month, year: $year) {
      totalSales
      cgst
      sgst
      igst
      totalGst
    }
  }
`;