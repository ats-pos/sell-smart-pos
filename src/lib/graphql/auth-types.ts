// Authentication Type Definitions
export interface LoginInput {
  email: string;
  password: string;
  deviceId?: string;
  rememberMe?: boolean;
}

export interface OTPLoginInput {
  phone: string;
  otp: string;
  deviceId?: string;
}

export interface PINLoginInput {
  userId: string;
  pin: string;
  deviceId?: string;
}

export interface BiometricInput {
  userId: string;
  biometricData: string;
  deviceId?: string;
}

export interface ResetPINInput {
  userId: string;
  newPin: string;
  verificationCode?: string;
}

export interface StoreRegistrationInput {
  name: string;
  type: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  gstin?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  deviceId: string;
}

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'admin' | 'manager' | 'cashier';
  storeId: string;
  lastLogin?: string;
  isActive: boolean;
  avatar?: string;
  pinEnabled?: boolean;
  biometricEnabled?: boolean;
}

export interface Store {
  id: string;
  name: string;
  type: string;
  gstin?: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  store?: Store;
  message: string;
}

export interface DeviceUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  lastLogin?: string;
  isActive: boolean;
  avatar?: string;
}