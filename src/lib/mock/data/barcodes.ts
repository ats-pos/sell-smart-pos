import { BarcodeData } from '@/lib/graphql/types';

export const mockBarcodes: BarcodeData[] = [
  {
    id: 'barcode-1',
    productName: 'Wireless Bluetooth Headphones',
    sku: 'WBH-001',
    price: 2999,
    barcode: '1234567890123',
    barcodeType: 'EAN-13',
    brand: 'Sony',
    createdAt: new Date('2024-01-15').toISOString()
  },
  {
    id: 'barcode-2',
    productName: 'Smartphone Power Bank 10000mAh',
    sku: 'SPB-002',
    price: 1499,
    barcode: '2345678901234',
    barcodeType: 'EAN-13',
    brand: 'Anker',
    createdAt: new Date('2024-02-01').toISOString()
  },
  {
    id: 'barcode-3',
    productName: 'USB-C Fast Charging Cable',
    sku: 'UCC-003',
    price: 599,
    barcode: '3456789012345',
    barcodeType: 'EAN-13',
    brand: 'Belkin',
    createdAt: new Date('2024-02-10').toISOString()
  },
  {
    id: 'barcode-4',
    productName: 'Wireless Mouse',
    sku: 'WM-004',
    price: 899,
    barcode: '4567890123456',
    barcodeType: 'EAN-13',
    brand: 'Logitech',
    createdAt: new Date('2024-03-01').toISOString()
  },
  {
    id: 'barcode-5',
    productName: 'Bluetooth Speaker',
    sku: 'BS-005',
    price: 3499,
    barcode: '5678901234567',
    barcodeType: 'EAN-13',
    brand: 'JBL',
    createdAt: new Date('2024-03-15').toISOString()
  }
];