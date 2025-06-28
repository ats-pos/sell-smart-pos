import { Store } from '@/lib/graphql/auth-types';
import { StoreProfile } from '@/lib/graphql/types';

export const mockStore: Store = {
  id: 'store-1',
  name: 'Tech Mart Electronics',
  type: 'Electronics Store',
  gstin: '29ABCDE1234F1Z5',
  address: '123 Main Street, Tech Park, Bangalore, Karnataka 560001',
  phone: '080-12345678',
  email: 'info@techmart.com',
  createdAt: new Date('2024-01-01').toISOString()
};

export const mockStoreProfile: StoreProfile = {
  id: 'store-1',
  name: 'Tech Mart Electronics',
  address: '123 Main Street, Tech Park, Bangalore, Karnataka 560001',
  phone: '080-12345678',
  email: 'info@techmart.com',
  gstin: '29ABCDE1234F1Z5',
  showOnReceipt: true
};