import { graphql } from 'msw';
import { 
  mockProducts, 
  mockSales, 
  mockCustomers, 
  mockBarcodes,
  mockAnalytics 
} from '../data';
import type { 
  Product, 
  Sale, 
  Customer, 
  Barcode, 
  ProductInput, 
  SaleInput,
  SaleItem,
  SaleItemInput
} from '../../../lib/graphql/types';

let products = [...mockProducts];
let sales = [...mockSales];
let customers = [...mockCustomers];
let barcodes = [...mockBarcodes];

// Helper function to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const dataHandlers = [
  // Product handlers
  graphql.query('GetProducts', () => {
    return {
      data: {
        products
      }
    };
  }),

  graphql.mutation('CreateProduct', ({ variables }) => {
    const { input } = variables as { input: ProductInput };
    
    const newProduct: Product = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...input
    };
    
    products.unshift(newProduct);
    
    return {
      data: {
        createProduct: newProduct
      }
    };
  }),

  graphql.mutation('UpdateProduct', ({ variables }) => {
    const { id, input } = variables as { id: string, input: ProductInput };
    
    products = products.map(product => product.id === id ? { ...product, ...input } : product);
    
    return {
      data: {
        updateProduct: products.find(product => product.id === id)
      }
    };
  }),

  graphql.mutation('DeleteProduct', ({ variables }) => {
    const { id } = variables as { id: string };
    
    products = products.filter(product => product.id !== id);
    
    return {
      data: {
        deleteProduct: id
      }
    };
  }),

  // Customer handlers
  graphql.query('GetCustomers', () => {
    return {
      data: {
        customers
      }
    };
  }),

  graphql.mutation('CreateCustomer', ({ variables }) => {
    const { input } = variables as { input: Customer };
    
    const newCustomer: Customer = {
      id: generateId(),
      ...input
    };
    
    customers.unshift(newCustomer);
    
    return {
      data: {
        createCustomer: newCustomer
      }
    };
  }),

  graphql.mutation('UpdateCustomer', ({ variables }) => {
    const { id, input } = variables as { id: string, input: Customer };
    
    customers = customers.map(customer => customer.id === id ? { ...customer, ...input } : customer);
    
    return {
      data: {
        updateCustomer: customers.find(customer => customer.id === id)
      }
    };
  }),

  graphql.mutation('DeleteCustomer', ({ variables }) => {
    const { id } = variables as { id: string };
    
    customers = customers.filter(customer => customer.id !== id);
    
    return {
      data: {
        deleteCustomer: id
      }
    };
  }),

  // Barcode handlers
  graphql.query('GetBarcodes', () => {
    return {
      data: {
        barcodes
      }
    };
  }),

  graphql.mutation('CreateBarcode', ({ variables }) => {
    const { input } = variables as { input: Barcode };
    
    const newBarcode: Barcode = {
      id: generateId(),
      ...input
    };
    
    barcodes.unshift(newBarcode);
    
    return {
      data: {
        createBarcode: newBarcode
      }
    };
  }),

  graphql.mutation('UpdateBarcode', ({ variables }) => {
    const { id, input } = variables as { id: string, input: Barcode };
    
    barcodes = barcodes.map(barcode => barcode.id === id ? { ...barcode, ...input } : barcode);
    
    return {
      data: {
        updateBarcode: barcodes.find(barcode => barcode.id === id)
      }
    };
  }),

  graphql.mutation('DeleteBarcode', ({ variables }) => {
    const { id } = variables as { id: string };
    
    barcodes = barcodes.filter(barcode => barcode.id !== id);
    
    return {
      data: {
        deleteBarcode: id
      }
    };
  }),

  // Analytics handlers
  graphql.query('GetAnalytics', () => {
    return {
      data: {
        analytics: mockAnalytics
      }
    };
  }),

  // Sales handlers
  graphql.query('GetSales', () => {
    return {
      data: {
        sales: sales.map(sale => ({
          ...sale,
          items: sale.items.map(item => ({
            ...item,
            id: item.id || generateId()
          }))
        }))
      }
    };
  }),

  graphql.mutation('CreateSale', ({ variables }) => {
    const { input } = variables as { input: SaleInput };
    
    const newSale: Sale = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      billNumber: `BILL-${Date.now()}`,
      customerId: input.customerId,
      customerName: input.customerName,
      items: input.items.map((item: SaleItemInput): SaleItem => ({
        ...item,
        id: generateId()
      })),
      subtotal: input.subtotal,
      discount: input.discount || 0,
      gst: input.gst || 0,
      total: input.total,
      paymentMethod: input.paymentMethod,
      status: input.status || 'completed'
    };
    
    sales.unshift(newSale);
    
    return {
      data: {
        createSale: newSale
      }
    };
  }),

  graphql.mutation('UpdateSale', ({ variables }) => {
    const { id, input } = variables as { id: string, input: SaleInput };
    
    sales = sales.map(sale => sale.id === id ? { ...sale, ...input } : sale);
    
    return {
      data: {
        updateSale: sales.find(sale => sale.id === id)
      }
    };
  }),

  graphql.mutation('DeleteSale', ({ variables }) => {
    const { id } = variables as { id: string };
    
    sales = sales.filter(sale => sale.id !== id);
    
    return {
      data: {
        deleteSale: id
      }
    };
  }),
];
