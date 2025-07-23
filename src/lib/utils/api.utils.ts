import { ApiResponse, ValidationError } from '@/lib/types/api.types'

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message || 'Operation completed successfully'
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: string | Error,
  code?: string
): ApiResponse<never> {
  const errorMessage = error instanceof Error ? error.message : error

  return {
    success: false,
    error: errorMessage,
    code: code || 'UNKNOWN_ERROR'
  }
}

/**
 * Creates a validation error response
 */
export function createValidationErrorResponse(
  errors: ValidationError[]
): ApiResponse<never> {
  return {
    success: false,
    error: 'Validation failed',
    code: 'VALIDATION_ERROR',
    message: errors.map(e => `${e.field}: ${e.message}`).join(', ')
  }
}

/**
 * Handles async operations with standardized error handling
 */
export async function handleAsyncOperation<T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<ApiResponse<T>> {
  try {
    const result = await operation()
    return createSuccessResponse(result)
  } catch (error) {
    console.error('Async operation failed:', error)
    return createErrorResponse(
      errorMessage || 'Operation failed',
      'OPERATION_FAILED'
    )
  }
}

/**
 * Validates required fields
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const field of requiredFields) {
    if (!data[field] || data[field] === '') {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED_FIELD'
      })
    }
  }

  return errors
}

/**
 * Sanitizes and validates numeric values
 */
export function validateNumericField(
  value: unknown,
  fieldName: string,
  options: {
    min?: number
    max?: number
    required?: boolean
  } = {}
): ValidationError[] {
  const errors: ValidationError[] = []

  if (options.required && (value === undefined || value === null)) {
    errors.push({
      field: fieldName,
      message: `${fieldName} is required`,
      code: 'REQUIRED_FIELD'
    })
    return errors
  }

  if (value !== undefined && value !== null) {
    const numValue = Number(value)

    if (isNaN(numValue)) {
      errors.push({
        field: fieldName,
        message: `${fieldName} must be a valid number`,
        code: 'INVALID_NUMBER'
      })
    } else {
      if (options.min !== undefined && numValue < options.min) {
        errors.push({
          field: fieldName,
          message: `${fieldName} must be at least ${options.min}`,
          code: 'MIN_VALUE'
        })
      }

      if (options.max !== undefined && numValue > options.max) {
        errors.push({
          field: fieldName,
          message: `${fieldName} must not exceed ${options.max}`,
          code: 'MAX_VALUE'
        })
      }
    }
  }

  return errors
}

/**
 * Formats currency values
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Calculates percentage change
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100 * 10) / 10
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Retry mechanism for failed API calls
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (i === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }

  throw lastError!
}
