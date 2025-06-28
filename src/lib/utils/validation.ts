import { VALIDATION_RULES } from './constants';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: "Email is required" };
  }
  
  if (!VALIDATION_RULES.email.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: "Phone number is required" };
  }
  
  if (!VALIDATION_RULES.phone.test(phone)) {
    return { isValid: false, error: "Invalid phone number format" };
  }
  
  return { isValid: true };
};

export const validateGSTIN = (gstin: string): ValidationResult => {
  if (!gstin) return { isValid: true }; // Optional field
  
  if (!VALIDATION_RULES.gstin.test(gstin)) {
    return { isValid: false, error: "Invalid GSTIN format" };
  }
  
  return { isValid: true };
};

export const validatePIN = (pin: string): ValidationResult => {
  if (!pin.trim()) {
    return { isValid: false, error: "PIN is required" };
  }
  
  if (pin.length < VALIDATION_RULES.pin.minLength || pin.length > VALIDATION_RULES.pin.maxLength) {
    return { isValid: false, error: `PIN must be ${VALIDATION_RULES.pin.minLength}-${VALIDATION_RULES.pin.maxLength} digits` };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  return { isValid: true };
};

export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.entries(rules).forEach(([field, validator]) => {
    const result = validator(data[field]);
    if (!result.isValid && result.error) {
      errors[field] = result.error;
    }
  });
  
  return errors;
};