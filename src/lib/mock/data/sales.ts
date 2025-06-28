import { Sale, SaleItem } from '@/lib/graphql/types';

const generateSaleItems = (saleId: string): SaleItem[] => {
  const items: SaleItem[] = [
    {
      id: `${saleId}-item-1`,
      productId: 'prod-1',
      productName: 'Wireless Bluetooth Headphones',
      price: 2999,
      quantity: 1,
      discount: 0,
      total: 2999
    },
    {
      id: `${saleId}-item-2`,
      productId: 'prod-3',
      productName: 'USB-C Fast Charging Cable',
      price: 599,
      quantity: 2,
      discount: 5,
      total: 1138.1
    }
  ];
  
  return items;
};

export const mockSales: Sale[] = [
  {
    id: 'sale-1',
    billNumber: 'INV-2024-001',
    customerId: 'cust-1',
    customerName: 'Rajesh Kumar',
    items: generateSaleItems('sale-1'),
    subtotal: 4137.1,
    discount: 0,
    gst: 744.68,
    total: 4881.78,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString() // 2 minutes ago
  },
  {
    id: 'sale-2',
    billNumber: 'INV-2024-002',
    customerId: 'cust-2',
    customerName: 'Priya Sharma',
    items: [
      {
        id: 'sale-2-item-1',
        productId: 'prod-2',
        productName: 'Smartphone Power Bank 10000mAh',
        price: 1499,
        quantity: 1,
        discount: 10,
        total: 1349.1
      }
    ],
    subtotal: 1349.1,
    discount: 0,
    gst: 242.84,
    total: 1591.94,
    paymentMethod: 'upi',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 minutes ago
  },
  {
    id: 'sale-3',
    billNumber: 'INV-2024-003',
    customerName: 'Walk-in Customer',
    items: [
      {
        id: 'sale-3-item-1',
        productId: 'prod-5',
        productName: 'Bluetooth Speaker',
        price: 3499,
        quantity: 1,
        discount: 0,
        total: 3499
      }
    ],
    subtotal: 3499,
    discount: 0,
    gst: 629.82,
    total: 4128.82,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 32).toISOString() // 32 minutes ago
  },
  {
    id: 'sale-4',
    billNumber: 'INV-2024-004',
    customerId: 'cust-3',
    customerName: 'Amit Patel',
    items: [
      {
        id: 'sale-4-item-1',
        productId: 'prod-4',
        productName: 'Wireless Mouse',
        price: 899,
        quantity: 2,
        discount: 0,
        total: 1798
      },
      {
        id: 'sale-4-item-2',
        productId: 'prod-6',
        productName: 'Phone Case - Clear',
        price: 299,
        quantity: 3,
        discount: 0,
        total: 897
      }
    ],
    subtotal: 2695,
    discount: 135, // 5% bill discount
    gst: 460.8,
    total: 3020.8,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString() // 1 hour ago
  },
  {
    id: 'sale-5',
    billNumber: 'INV-2024-005',
    customerId: 'cust-4',
    customerName: 'Sneha Reddy',
    items: [
      {
        id: 'sale-5-item-1',
        productId: 'prod-7',
        productName: 'Laptop Stand Adjustable',
        price: 1299,
        quantity: 1,
        discount: 0,
        total: 1299
      }
    ],
    subtotal: 1299,
    discount: 0,
    gst: 233.82,
    total: 1532.82,
    paymentMethod: 'upi',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  }
];