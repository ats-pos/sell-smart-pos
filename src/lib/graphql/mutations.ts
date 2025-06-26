import { gql } from '@apollo/client';

// Product Mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      name
      barcode
      price
      stock
      minStock
      category
      brand
      supplier
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      barcode
      price
      stock
      minStock
      category
      brand
      supplier
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

// Sales Mutations
export const CREATE_SALE = gql`
  mutation CreateSale($input: SaleInput!) {
    createSale(input: $input) {
      id
      billNumber
      customerId
      customerName
      items {
        id
        productId
        productName
        price
        quantity
        discount
        total
      }
      subtotal
      discount
      gst
      total
      paymentMethod
      status
      createdAt
    }
  }
`;

export const UPDATE_SALE = gql`
  mutation UpdateSale($id: ID!, $input: SaleInput!) {
    updateSale(id: $id, input: $input) {
      id
      billNumber
      customerId
      customerName
      items {
        id
        productId
        productName
        price
        quantity
        discount
        total
      }
      subtotal
      discount
      gst
      total
      paymentMethod
      status
      createdAt
    }
  }
`;

// Customer Mutations
export const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerInput!) {
    createCustomer(input: $input) {
      id
      name
      phone
      email
      gstin
      address
      createdAt
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    updateCustomer(id: $id, input: $input) {
      id
      name
      phone
      email
      gstin
      address
      createdAt
    }
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id) {
      success
      message
    }
  }
`;

// Barcode Mutations
export const CREATE_BARCODE = gql`
  mutation CreateBarcode($input: BarcodeInput!) {
    createBarcode(input: $input) {
      id
      productName
      sku
      price
      barcode
      barcodeType
      brand
      createdAt
    }
  }
`;

export const DELETE_BARCODE = gql`
  mutation DeleteBarcode($id: ID!) {
    deleteBarcode(id: $id) {
      success
      message
    }
  }
`;

// Store Profile Mutations
export const UPDATE_STORE_PROFILE = gql`
  mutation UpdateStoreProfile($input: StoreProfileInput!) {
    updateStoreProfile(input: $input) {
      id
      name
      address
      phone
      email
      gstin
      showOnReceipt
    }
  }
`;