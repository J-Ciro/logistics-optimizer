/**
 * @file constants.ts
 * @description Centralized constants for the application
 * Eliminates magic numbers and improves maintainability
 */

/**
 * Validation Constants
 */
export const VALIDATION = {
  WEIGHT: {
    MIN: 0.1, // kg
    MAX: 1000, // kg
    STEP: 0.1,
  },
  DATE: {
    MAX_DAYS_AHEAD: 30,
  },
} as const;

/**
 * Business Rules Constants
 */
export const BUSINESS_RULES = {
  FRAGILE_SURCHARGE_PERCENTAGE: 15, // 15% surcharge for fragile items
  FRAGILE_SURCHARGE_MULTIPLIER: 1.15,
} as const;

/**
 * API Configuration
 */
export const API = {
  DEFAULT_TIMEOUT: 30000, // 30 seconds
  DEFAULT_BASE_URL: 'http://localhost:3000',
  REFRESH_INTERVAL: 30000, // 30 seconds for provider status
} as const;

/**
 * Test Coverage Requirements
 */
export const TESTING = {
  MIN_COVERAGE_PERCENTAGE: 75,
} as const;

/**
 * Form Field Names
 */
export const FORM_FIELDS = {
  ORIGIN: 'origin',
  DESTINATION: 'destination',
  WEIGHT: 'weight',
  PICKUP_DATE: 'pickupDate',
  FRAGILE: 'fragile',
} as const;


export const iconMap = {
  error: '',
  warning: '⚠️',
  info: 'ℹ️',
};

export const classMap = {
  error: 'text-error',
  warning: 'text-warning',
  info: 'text-info',
};

export const statusConfig = {
  online: {
    icon: '🟢',
    label: 'En Línea',
    bgColor: 'bg-green-500',
    textColor: 'text-green-700',
  },
  offline: {
    icon: '🔴',
    label: 'Fuera de Línea',
    bgColor: 'bg-red-500',
    textColor: 'text-red-700',
  },
  degraded: {
    icon: '⚠️',
    label: 'Degradado',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-700',
  },
};
