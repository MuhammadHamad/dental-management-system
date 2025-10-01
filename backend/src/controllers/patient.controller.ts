import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, Patient, PaginatedResponse } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';

// Generate patient number
const generatePatientNumber = async (clinicId: string): Promise<string> => {
  const { data: lastPatient } = await supabase
    .from('patients')
    .select('patient_number')
    .eq('clinic_id', clinicId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (lastPatient?.patient_number) {
    const lastNumber = parseInt(lastPatient.patient_number.replace(/\D/g, ''));
    return `P${String(lastNumber + 1).padStart(6, '0')}`;
  }
  
  return 'P000001';
};

export const createPatient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    emergencyContactName,
    emergencyContactPhone,
    medicalHistory,
    allergies,
    insuranceProvider,
    insuranceNumber
  } = req.body;

  // Generate patient number
  const patientNumber = await generatePatientNumber(clinicId);

  // Check if email already exists for this clinic
  if (email) {
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('email', email)
      .single();

    if (existingPatient) {
      throw new CustomError('Patient with this email already exists', 409);
    }
  }

  const patientData = {
    clinic_id: clinicId,
    patient_number: patientNumber,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    gender,
    phone,
    email,
    address,
    emergency_contact_name: emergencyContactName,
    emergency_contact_phone: emergencyContactPhone,
    medical_history: medicalHistory,
    allergies,
    insurance_provider: insuranceProvider,
    insurance_number: insuranceNumber,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: patient, error } = await supabase
    .from('patients')
    .insert([patientData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to create patient', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Patient created successfully',
    data: patient
  });
});

export const getPatients = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    status,
    gender
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  // Build query
  let query = supabase
    .from('patients')
    .select('*', { count: 'exact' })
    .eq('clinic_id', clinicId);

  // Apply filters
  if (search) {
    query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,patient_number.ilike.%${search}%`);
  }

  if (gender) {
    query = query.eq('gender', gender);
  }

  // Apply sorting
  query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: patients, error, count } = await query;

  if (error) {
    throw new CustomError('Failed to fetch patients', 400);
  }

  const totalPages = Math.ceil((count || 0) / Number(limit));

  const response: PaginatedResponse<Patient> = {
    success: true,
    message: 'Patients retrieved successfully',
    data: patients || [],
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: count || 0,
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1
    }
  };

  res.json(response);
});

export const getPatientById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  const { data: patient, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (error || !patient) {
    throw new CustomError('Patient not found', 404);
  }

  res.json({
    success: true,
    message: 'Patient retrieved successfully',
    data: patient
  });
});

export const updatePatient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const updateData = req.body;

  // Check if patient exists and belongs to clinic
  const { data: existingPatient, error: fetchError } = await supabase
    .from('patients')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingPatient) {
    throw new CustomError('Patient not found', 404);
  }

  // Check email uniqueness if email is being updated
  if (updateData.email) {
    const { data: emailCheck } = await supabase
      .from('patients')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('email', updateData.email)
      .neq('id', id)
      .single();

    if (emailCheck) {
      throw new CustomError('Patient with this email already exists', 409);
    }
  }

  // Prepare update data
  const patientUpdateData = {
    first_name: updateData.firstName,
    last_name: updateData.lastName,
    date_of_birth: updateData.dateOfBirth,
    gender: updateData.gender,
    phone: updateData.phone,
    email: updateData.email,
    address: updateData.address,
    emergency_contact_name: updateData.emergencyContactName,
    emergency_contact_phone: updateData.emergencyContactPhone,
    medical_history: updateData.medicalHistory,
    allergies: updateData.allergies,
    insurance_provider: updateData.insuranceProvider,
    insurance_number: updateData.insuranceNumber,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(patientUpdateData).forEach(key => {
    if (patientUpdateData[key as keyof typeof patientUpdateData] === undefined) {
      delete patientUpdateData[key as keyof typeof patientUpdateData];
    }
  });

  const { data: patient, error } = await supabase
    .from('patients')
    .update(patientUpdateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update patient', 400);
  }

  res.json({
    success: true,
    message: 'Patient updated successfully',
    data: patient
  });
});

export const deletePatient = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Check if patient exists and belongs to clinic
  const { data: existingPatient, error: fetchError } = await supabase
    .from('patients')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingPatient) {
    throw new CustomError('Patient not found', 404);
  }

  // Check if patient has any appointments
  const { data: appointments } = await supabase
    .from('appointments')
    .select('id')
    .eq('patient_id', id)
    .limit(1);

  if (appointments && appointments.length > 0) {
    throw new CustomError('Cannot delete patient with existing appointments', 400);
  }

  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId);

  if (error) {
    throw new CustomError('Failed to delete patient', 400);
  }

  res.json({
    success: true,
    message: 'Patient deleted successfully'
  });
});

export const getPatientAppointments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Verify patient belongs to clinic
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (patientError || !patient) {
    throw new CustomError('Patient not found', 404);
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      patients!inner(first_name, last_name, patient_number)
    `)
    .eq('patient_id', id)
    .eq('clinic_id', clinicId)
    .order('appointment_date', { ascending: false });

  if (error) {
    throw new CustomError('Failed to fetch patient appointments', 400);
  }

  res.json({
    success: true,
    message: 'Patient appointments retrieved successfully',
    data: appointments || []
  });
});

export const getPatientTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Verify patient belongs to clinic
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (patientError || !patient) {
    throw new CustomError('Patient not found', 404);
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('patient_id', id)
    .eq('clinic_id', clinicId)
    .order('transaction_date', { ascending: false });

  if (error) {
    throw new CustomError('Failed to fetch patient transactions', 400);
  }

  res.json({
    success: true,
    message: 'Patient transactions retrieved successfully',
    data: transactions || []
  });
});
