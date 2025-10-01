// API Response Messages
export const MESSAGES = {
  AUTH: {
    SIGNUP_SUCCESS: 'User created successfully',
    SIGNIN_SUCCESS: 'Sign in successful',
    SIGNOUT_SUCCESS: 'Signed out successfully',
    PASSWORD_RESET_SENT: 'Password reset email sent',
    PASSWORD_RESET_SUCCESS: 'Password reset successfully',
    PASSWORD_CHANGED: 'Password updated successfully',
    PROFILE_UPDATED: 'Profile updated successfully',
    TOKENS_REFRESHED: 'Tokens refreshed successfully',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists with this email',
    USER_NOT_FOUND: 'User not found',
    INVALID_TOKEN: 'Invalid or expired token',
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Insufficient permissions'
  },
  PATIENT: {
    CREATED: 'Patient created successfully',
    UPDATED: 'Patient updated successfully',
    DELETED: 'Patient deleted successfully',
    NOT_FOUND: 'Patient not found',
    EXISTS: 'Patient with this email already exists',
    HAS_APPOINTMENTS: 'Cannot delete patient with existing appointments'
  },
  APPOINTMENT: {
    CREATED: 'Appointment created successfully',
    UPDATED: 'Appointment updated successfully',
    DELETED: 'Appointment deleted successfully',
    STATUS_UPDATED: 'Appointment status updated successfully',
    NOT_FOUND: 'Appointment not found',
    CONFLICT: 'Appointment time conflicts with existing appointment',
    CANNOT_DELETE_COMPLETED: 'Cannot delete completed appointments',
    BOOKED: 'Appointment booked successfully'
  },
  TREATMENT: {
    CREATED: 'Treatment created successfully',
    UPDATED: 'Treatment updated successfully',
    DELETED: 'Treatment deleted successfully',
    NOT_FOUND: 'Treatment not found',
    EXISTS: 'Treatment with this name already exists',
    IN_USE: 'Cannot delete treatment that is used in appointments'
  },
  INVENTORY: {
    CREATED: 'Inventory item created successfully',
    UPDATED: 'Inventory item updated successfully',
    DELETED: 'Inventory item deleted successfully',
    STOCK_UPDATED: 'Stock updated successfully',
    NOT_FOUND: 'Inventory item not found',
    EXISTS: 'Inventory item with this name already exists'
  },
  TRANSACTION: {
    CREATED: 'Transaction created successfully',
    UPDATED: 'Transaction updated successfully',
    DELETED: 'Transaction deleted successfully',
    NOT_FOUND: 'Transaction not found'
  },
  GENERAL: {
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Internal Server Error',
    NOT_FOUND: 'Resource not found',
    RETRIEVED: 'Retrieved successfully'
  }
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PATIENT: 'patient'
} as const;

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  PAYMENT: 'payment',
  REFUND: 'refund',
  EXPENSE: 'expense'
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  CREDIT_CARD: 'credit_card',
  EASYPAISA: 'easypaisa',
  JAZZCASH: 'jazzcash',
  INSURANCE: 'insurance'
} as const;

// Stock Update Types
export const STOCK_UPDATE_TYPES = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  SET: 'set'
} as const;

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  APPOINTMENT_DURATION: 60, // minutes
  PASSWORD_MIN_LENGTH: 8,
  EXPIRY_WARNING_DAYS: 30,
  BCRYPT_ROUNDS: 12
};

// Validation Patterns
export const PATTERNS = {
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  TIME: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Error Codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
} as const;
