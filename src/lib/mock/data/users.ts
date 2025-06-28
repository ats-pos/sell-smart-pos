import { User, DeviceUser } from '@/lib/graphql/auth-types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'admin@spmpos.com',
    name: 'Admin User',
    role: 'admin',
    storeId: 'store-1',
    lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    pinEnabled: true,
    biometricEnabled: true
  },
  {
    id: 'user-2',
    email: 'manager@spmpos.com',
    name: 'Store Manager',
    role: 'manager',
    storeId: 'store-1',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    pinEnabled: true,
    biometricEnabled: false
  },
  {
    id: 'user-3',
    email: 'cashier@spmpos.com',
    phone: '9876543210',
    name: 'Cashier One',
    role: 'cashier',
    storeId: 'store-1',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    pinEnabled: true,
    biometricEnabled: true
  },
  {
    id: 'user-4',
    email: 'cashier2@spmpos.com',
    phone: '9876543211',
    name: 'Cashier Two',
    role: 'cashier',
    storeId: 'store-1',
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isActive: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    pinEnabled: false,
    biometricEnabled: false
  }
];

export const mockDeviceUsers: DeviceUser[] = mockUsers.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  lastLogin: user.lastLogin,
  isActive: user.isActive,
  avatar: user.avatar
}));