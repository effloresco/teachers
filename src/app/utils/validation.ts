import _ from 'lodash';
import { PHONE_PATTERNS } from './constants';
import { ValidationResult } from './types';

export function isCapitalizedString(val: any): boolean {
  if (!_.isString(val) || _.isEmpty(_.trim(val))) {
    return false;
  }
  const trimmed = _.trim(val);
  const firstChar = _.head(trimmed)!;
  return firstChar === _.toUpper(firstChar);
}

export function isValidPhone(phone: any, country: string): boolean {
  if (!_.isString(phone)) return false;
  const pattern = PHONE_PATTERNS[country];

  if (pattern) {
    return pattern.test(phone);
  } else {
    const generalPattern = /^[+]?[\d\s\-\(\)]{7,20}$/;
    const digitsCount = _.filter(phone, (char) => /\d/.test(char)).length;
    return generalPattern.test(phone) && digitsCount >= 7;
  }
}

export function validateFullName(name: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (_.isEmpty(name)) {
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

  const invalidField = _.find(optionalStringFields, (field) => {
    return user?.[field] && !isCapitalizedString(user[field]);
  });

  if (invalidField) {
    result.errorMessage = `Field ${invalidField} must begin with a capital letter.`;
    result.isValid = false;
  }

  return result;
}

export function validateAge(age: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errorMessage: '' };
  if (_.isNil(age)) {
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
  if (_.isEmpty(phone)) {
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
  if (_.isEmpty(email)) {
    result.errorMessage = "Email is required.";
    result.isValid = false;
  } else if (!_.includes(email, '@') || !_.includes(email, '.')) {
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

  const validations = [
    validateFullName(user.full_name),
    validateOptionalStrings(user),
    validateAge(user.age),
    validatePhoneNumber(user.phone, user.country),
    validateEmail(user.email),
    validateNote(user.note)
  ];

  const messages = _(validations)
    .filter((v) => !v.isValid)
    .map('errorMessage')
    .value();

  return { isValid: _.isEmpty(messages), messages };
}