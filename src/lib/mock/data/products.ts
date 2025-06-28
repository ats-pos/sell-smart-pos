import { Product } from '@/lib/graphql/types';

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Bluetooth Headphones',
    barcode: '1234567890123',
    price: 2999,
    stock: 25,
    minStock: 10,
    category: 'Electronics',
    brand: 'Sony',
    supplier: 'Sony India',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-12-20').toISOString()
  },
  {
    id: 'prod-2',
    name: 'Smartphone Power Bank 10000mAh',
    barcode: '2345678901234',
    price: 1499,
    stock: 8,
    minStock: 15,
    category: 'Electronics',
    brand: 'Anker',
    supplier: 'Anker Innovations',
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date('2024-12-18').toISOString()
  },
  {
    id: 'prod-3',
    name: 'USB-C Fast Charging Cable',
    barcode: '3456789012345',
    price: 599,
    stock: 50,
    minStock: 20,
    category: 'Accessories',
    brand: 'Belkin',
    supplier: 'Belkin International',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-12-19').toISOString()
  },
  {
    id: 'prod-4',
    name: 'Wireless Mouse',
    barcode: '4567890123456',
    price: 899,
    stock: 3,
    minStock: 10,
    category: 'Electronics',
    brand: 'Logitech',
    supplier: 'Logitech India',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-12-15').toISOString()
  },
  {
    id: 'prod-5',
    name: 'Bluetooth Speaker',
    barcode: '5678901234567',
    price: 3499,
    stock: 15,
    minStock: 8,
    category: 'Electronics',
    brand: 'JBL',
    supplier: 'Harman International',
    createdAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-12-22').toISOString()
  },
  {
    id: 'prod-6',
    name: 'Phone Case - Clear',
    barcode: '6789012345678',
    price: 299,
    stock: 1,
    minStock: 5,
    category: 'Accessories',
    brand: 'Generic',
    supplier: 'Local Supplier',
    createdAt: new Date('2024-04-01').toISOString(),
    updatedAt: new Date('2024-12-10').toISOString()
  },
  {
    id: 'prod-7',
    name: 'Laptop Stand Adjustable',
    barcode: '7890123456789',
    price: 1299,
    stock: 12,
    minStock: 6,
    category: 'Accessories',
    brand: 'Rain Design',
    supplier: 'Rain Design Inc',
    createdAt: new Date('2024-04-15').toISOString(),
    updatedAt: new Date('2024-12-21').toISOString()
  },
  {
    id: 'prod-8',
    name: 'Webcam HD 1080p',
    barcode: '8901234567890',
    price: 2199,
    stock: 7,
    minStock: 5,
    category: 'Electronics',
    brand: 'Logitech',
    supplier: 'Logitech India',
    createdAt: new Date('2024-05-01').toISOString(),
    updatedAt: new Date('2024-12-23').toISOString()
  }
];