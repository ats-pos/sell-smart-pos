import { mockUsers, mockDeviceUsers } from '../data/users';
import { mockStore } from '../data/stores';
import { AuthResponse, LoginInput, OTPLoginInput, PINLoginInput, StoreRegistrationInput } from '@/lib/graphql/auth-types';

// Mock authentication handlers
export const mockAuthHandlers = {
  loginUser: async (input: LoginInput): Promise<{ loginUser: AuthResponse }> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    const user = mockUsers.find(u => u.email === input.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Mock password validation (in real app, this would be secure)
    const validPasswords: Record<string, string> = {
      'admin@spmpos.com': 'admin123',
      'manager@spmpos.com': 'manager123',
      'cashier@spmpos.com': 'cashier123',
      'cashier2@spmpos.com': 'cashier123'
    };
    
    if (validPasswords[input.email] !== input.password) {
      throw new Error('Invalid password');
    }
    
    return {
      loginUser: {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
        store: mockStore,
        message: 'Login successful'
      }
    };
  },

  loginWithOTP: async (input: OTPLoginInput): Promise<{ loginWithOTP: AuthResponse }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.phone === input.phone);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Mock OTP validation (always accept 123456 for demo)
    if (input.otp !== '123456') {
      throw new Error('Invalid OTP');
    }
    
    return {
      loginWithOTP: {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
        store: mockStore,
        message: 'OTP login successful'
      }
    };
  },

  loginWithPIN: async (input: PINLoginInput): Promise<{ loginWithPIN: AuthResponse }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === input.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Mock PIN validation (always accept 1234 for demo)
    if (input.pin !== '1234') {
      throw new Error('Invalid PIN');
    }
    
    return {
      loginWithPIN: {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
        store: mockStore,
        message: 'PIN login successful'
      }
    };
  },

  sendOTP: async (phone: string): Promise<{ sendOTP: { success: boolean; message: string; otpSent: boolean } }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      sendOTP: {
        success: true,
        message: 'OTP sent successfully',
        otpSent: true
      }
    };
  },

  registerStore: async (input: StoreRegistrationInput): Promise<{ registerStore: AuthResponse }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newStore = {
      id: `store-${Date.now()}`,
      name: input.name,
      type: input.type,
      gstin: input.gstin || '',
      address: `${input.address}, ${input.city}, ${input.state} ${input.pincode}`,
      phone: input.ownerPhone,
      email: input.ownerEmail,
      createdAt: new Date().toISOString()
    };
    
    const newUser = {
      id: `user-${Date.now()}`,
      email: input.ownerEmail,
      name: input.ownerName,
      role: 'admin' as const,
      storeId: newStore.id,
      lastLogin: new Date().toISOString(),
      isActive: true
    };
    
    return {
      registerStore: {
        success: true,
        token: `mock-token-${newUser.id}-${Date.now()}`,
        user: newUser,
        store: newStore,
        message: 'Store registered successfully'
      }
    };
  },

  getDeviceUsers: async (deviceId: string): Promise<{ deviceUsers: typeof mockDeviceUsers }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      deviceUsers: mockDeviceUsers
    };
  },

  checkStoreExists: async (deviceId: string): Promise<{ storeExists: { exists: boolean; store?: typeof mockStore } }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      storeExists: {
        exists: true,
        store: mockStore
      }
    };
  },

  forgotPassword: async (email: string): Promise<{ forgotPassword: { success: boolean; message: string } }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      forgotPassword: {
        success: true,
        message: 'Password reset link sent to your email'
      }
    };
  },

  verifyBiometric: async (input: any): Promise<{ verifyBiometric: AuthResponse }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.id === input.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      verifyBiometric: {
        success: true,
        token: `mock-token-${user.id}-${Date.now()}`,
        user,
        store: mockStore,
        message: 'Biometric authentication successful'
      }
    };
  }
};