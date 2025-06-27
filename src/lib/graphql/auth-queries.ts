import { gql } from '@apollo/client';

// Authentication Queries
export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    loginUser(input: $input) {
      success
      token
      user {
        id
        email
        name
        role
        storeId
        lastLogin
        isActive
      }
      store {
        id
        name
        type
        gstin
        address
        phone
        email
      }
      message
    }
  }
`;

export const LOGIN_WITH_OTP = gql`
  mutation LoginWithOTP($input: OTPLoginInput!) {
    loginWithOTP(input: $input) {
      success
      token
      user {
        id
        phone
        name
        role
        storeId
        lastLogin
        isActive
      }
      store {
        id
        name
        type
        gstin
        address
        phone
        email
      }
      message
    }
  }
`;

export const SEND_OTP = gql`
  mutation SendOTP($phone: String!) {
    sendOTP(phone: $phone) {
      success
      message
      otpSent
    }
  }
`;

export const LOGIN_WITH_PIN = gql`
  mutation LoginWithPIN($input: PINLoginInput!) {
    loginWithPIN(input: $input) {
      success
      token
      user {
        id
        email
        name
        role
        storeId
        lastLogin
        isActive
      }
      message
    }
  }
`;

export const REGISTER_STORE = gql`
  mutation RegisterStore($input: StoreRegistrationInput!) {
    registerStore(input: $input) {
      success
      store {
        id
        name
        type
        gstin
        address
        phone
        email
        createdAt
      }
      user {
        id
        email
        name
        role
        storeId
      }
      token
      message
    }
  }
`;

export const GET_DEVICE_USERS = gql`
  query GetDeviceUsers($deviceId: String!) {
    deviceUsers(deviceId: $deviceId) {
      id
      name
      email
      phone
      role
      lastLogin
      isActive
      avatar
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PIN = gql`
  mutation ResetPIN($input: ResetPINInput!) {
    resetPIN(input: $input) {
      success
      message
    }
  }
`;

export const VERIFY_BIOMETRIC = gql`
  mutation VerifyBiometric($input: BiometricInput!) {
    verifyBiometric(input: $input) {
      success
      token
      user {
        id
        email
        name
        role
        storeId
        lastLogin
        isActive
      }
      message
    }
  }
`;

export const CHECK_STORE_EXISTS = gql`
  query CheckStoreExists($deviceId: String!) {
    storeExists(deviceId: $deviceId) {
      exists
      store {
        id
        name
        type
        gstin
        address
        phone
        email
      }
    }
  }
`;