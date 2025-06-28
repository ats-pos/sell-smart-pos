import { Customer } from '@/lib/graphql/types';

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh.kumar@email.com',
    gstin: '29ABCDE1234F1Z5',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'cust-2',
    name: 'Priya Sharma',
    phone: '9876543211',
    email: 'priya.sharma@email.com',
    gstin: '',
    address: '456 Brigade Road, Bangalore, Karnataka 560025',
    createdAt: new Date('2024-02-20').toISOString()
  },
  {
    id: 'cust-3',
    name: 'Amit Patel',
    phone: '9876543212',
    email: 'amit.patel@email.com',
    gstin: '24ABCDE1234F1Z5',
    address: '789 Commercial Street, Bangalore, Karnataka 560001',
    createdAt: new Date('2024-03-10').toISOString()
  },
  {
    id: 'cust-4',
    name: 'Sneha Reddy',
    phone: '9876543213',
    email: 'sneha.reddy@email.com',
    gstin: '',
    address: '321 Koramangala, Bangalore, Karnataka 560034',
    createdAt: new Date('2024-04-05').toISOString()
  },
  {
    id: 'cust-5',
    name: 'Vikram Singh',
    phone: '9876543214',
    email: 'vikram.singh@email.com',
    gstin: '07ABCDE1234F1Z5',
    address: '654 Indiranagar, Bangalore, Karnataka 560038',
    createdAt: new Date('2024-05-12').toISOString()
  }
];