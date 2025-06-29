// Application Constants
export const APP_CONFIG = {
  name: "SPM-POS",
  tagline: "Sell Smart. Grow Fast.",
  version: "1.0.0",
  lastUpdated: "Dec 24, 2024"
} as const;

export const API_ENDPOINTS = {
  graphql: "https://indyzgql-api.netlify.app/graphql",
  rest: "http://api.indyzai.com/api"
} as const;

export const STORAGE_KEYS = {
  authToken: "auth-token",
  currentUser: "current-user",
  currentStore: "current-store",
  deviceId: "device-id",
  biometric: (userId: string) => `biometric-${userId}`,
  offlineData: "spmpos-offline-data",
  deviceInfo: "spmpos-device-info"
} as const;

export const ROUTES = {
  login: "/login",
  admin: "/admin",
  purchase: "/purchase",
  saleOperator: "/",
  settings: "/settings"
} as const;

export const USER_ROLES = {
  admin: "admin",
  manager: "manager",
  cashier: "cashier"
} as const;

export const PAYMENT_METHODS = {
  card: "card",
  upi: "upi",
  cash: "cash",
  split: "split"
} as const;

export const SALE_STATUS = {
  completed: "completed",
  pending: "pending",
  cancelled: "cancelled"
} as const;

export const BARCODE_TYPES = [
  "EAN-13",
  "EAN-8", 
  "UPC-A",
  "Code 128",
  "Code 39"
] as const;

export const STORE_TYPES = [
  "Retail Store",
  "Grocery Store",
  "Electronics Store", 
  "Clothing Store",
  "Restaurant",
  "Pharmacy",
  "Hardware Store",
  "Book Store",
  "Jewelry Store",
  "Other"
] as const;

export const VALIDATION_RULES = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[6-9]\d{9}$/,
  gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  pin: {
    minLength: 4,
    maxLength: 6
  },
  otp: {
    length: 6
  }
} as const;

export const UI_CONFIG = {
  autoLogoutTime: {
    shared: 15, // minutes
    personal: 60 // minutes
  },
  pagination: {
    defaultLimit: 50,
    maxLimit: 100
  },
  toast: {
    duration: 5000
  }
} as const;