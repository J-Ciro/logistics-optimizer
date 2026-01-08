
import { QuoteValidator } from '../utils/validation/QuoteValidator';


export function useWeightValidation(weight: number): string | null {
  const error = QuoteValidator.validateField('weight', weight);
  return error || null;
}

export function useDateValidation(date: string): string | null {
  const error = QuoteValidator.validateField('pickupDate', date);
  return error || null;
}

export function useRequiredValidation(value: string, fieldName: string): string | null {
  if (!value || value === null || value === undefined || value.trim() === '') {
    return `El ${fieldName} es requerido`;
  }
  return null;
}

