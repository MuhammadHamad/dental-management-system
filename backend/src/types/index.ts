import { Request } from 'express';

// User types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'patient';
  clinic_id: string;
  created_at: string;
  updated_at: string;
}

// Extended Request interface with user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Patient types
export interface Patient {
  id: string;
  clinic_id: string;
  user_id?: string;
  patient_number: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_history?: string;
  allergies?: string;
  insurance_provider?: string;
  insurance_number?: string;
  created_at: string;
  updated_at: string;
}

// Appointment types
export interface Appointment {
  id: string;
  clinic_id: string;
  patient_id: string;
  dentist_id?: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes?: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  created_at: string;
  updated_at: string;
}

// Treatment types
export interface Treatment {
  id: string;
  clinic_id: string;
  name: string;
  description?: string;
  duration_minutes?: number;
  price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Inventory types
export interface InventoryItem {
  id: string;
  clinic_id: string;
  item_name: string;
  category: string;
  brand?: string;
  supplier?: string;
  current_stock: number;
  minimum_stock: number;
  unit_cost?: number;
  expiry_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Transaction types
export interface Transaction {
  id: string;
  clinic_id: string;
  appointment_id?: string;
  patient_id?: string;
  transaction_type: 'payment' | 'refund' | 'expense';
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'easypaisa' | 'jazzcash' | 'insurance';
  amount: number;
  description: string;
  transaction_date: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  clinicId: string;
  iat?: number;
  exp?: number;
}
