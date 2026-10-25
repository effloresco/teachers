import { PHONE_PATTERNS } from './constants';
import { ValidationResult } from './types';

export function isCapitalizedString(val: any): boolean {
  if (typeof val !== 'string' || val.trim().length === 0) {
    return false;
  }
  const firstChar = val.trim()[0];
  return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
}

export function isValidPhone(phone: any, country: string): boolean {
  if (typeof phone !== 'string') return false;
  const pattern = PHONE_PATTERNS[country];

  if (pattern) {
    return pattern.test(phone);
  } else {
    const generalPattern = /^[+]?[\d\s\-\(\)]{7,20}$/;
    const digitsCount = (phone.match(/\d/g) || []).length;
    return generalPattern.test(phone) && digitsCount >= 7;
  }
}

export function validateFullName(name: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (!name) {
    result.errorMessage = "Field 'Full name' is required.";
    result.isValid = false;
  } else if (!isCapitalizedString(name)) {
    result.errorMessage = "Field name must begin with a capital letter.";
    result.isValid = false;
  }
  return result;
}

const optionalStringFields = ['state', 'city'];
export function validateOptionalStrings(user: any): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  for (const field of optionalStringFields) {
    if (user[field] && !isCapitalizedString(user[field])) {
      result.errorMessage = `Field ${field} must begin with a capital letter.`;
      result.isValid = false;
      break;
    }
  }
  return result;
}

export function validateAge(age: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (age === undefined || age === null) {
    result.errorMessage = "Field age is required.";
    result.isValid = false;
  } else if (age <= 16 || age > 120) {
    result.errorMessage = "Incorrect age.";
    result.isValid = false;
  }
  return result;
}

export function validatePhoneNumber(phone: string, country: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (!phone) {
    result.errorMessage = "Phone number is required.";
    result.isValid = false;
  } else if (country && !isValidPhone(phone, country)) {
    result.errorMessage = `Incorrect phone number format for ${country}.`;
    result.isValid = false;
  }
  return result;
}

export function validateEmail(email: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (!email) {
    result.errorMessage = "Email is required.";
    result.isValid = false;
  } else if (!email.includes('@') || !email.includes('.')) {
    result.errorMessage = "Incorrect email address.";
    result.isValid = false;
  }
  return result;
}

export function validateNote(note: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (note && !isCapitalizedString(note)) {
    result.errorMessage = "Field note must begin with a capital letter.";
    result.isValid = false;
  }
  return result;
}

export function validateUser(user: any) {
  let messages: string[] = [];

  const validations = [
    validateFullName(user.full_name),
    validateOptionalStrings(user),
    validateAge(user.age),
    validatePhoneNumber(user.phone, user.country),
    validateEmail(user.email),
    validateNote(user.note)
  ];

  for (const v of validations) {
    if (!v.isValid) {
      messages.push(v.errorMessage);
    }
  }

  return { isValid: messages.length === 0, messages };
}