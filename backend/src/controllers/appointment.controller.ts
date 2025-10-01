import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, Appointment, PaginatedResponse } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';
import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';

export const createAppointment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    patientId,
    dentistId,
    appointmentDate,
    appointmentTime,
    durationMinutes = 60,
    notes,
    treatmentIds = []
  } = req.body;

  // Verify patient belongs to clinic
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('id', patientId)
    .eq('clinic_id', clinicId)
    .single();

  if (patientError || !patient) {
    throw new CustomError('Patient not found', 404);
  }

  // Check for appointment conflicts
  const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
  const endDateTime = new Date(appointmentDateTime.getTime() + durationMinutes * 60000);

  const { data: conflicts } = await supabase
    .from('appointments')
    .select('id, appointment_date, appointment_time, duration_minutes')
    .eq('clinic_id', clinicId)
    .eq('appointment_date', appointmentDate)
    .neq('status', 'cancelled');

  if (conflicts) {
    for (const conflict of conflicts) {
      const conflictStart = new Date(`${conflict.appointment_date}T${conflict.appointment_time}`);
      const conflictEnd = new Date(conflictStart.getTime() + (conflict.duration_minutes || 60) * 60000);

      if (
        (appointmentDateTime >= conflictStart && appointmentDateTime < conflictEnd) ||
        (endDateTime > conflictStart && endDateTime <= conflictEnd) ||
        (appointmentDateTime <= conflictStart && endDateTime >= conflictEnd)
      ) {
        throw new CustomError('Appointment time conflicts with existing appointment', 409);
      }
    }
  }

  const appointmentData = {
    clinic_id: clinicId,
    patient_id: patientId,
    dentist_id: dentistId,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    duration_minutes: durationMinutes,
    status: 'scheduled' as const,
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to create appointment', 400);
  }

  // Add treatments if provided
  if (treatmentIds.length > 0) {
    const treatmentData = treatmentIds.map((treatmentId: string) => ({
      appointment_id: appointment.id,
      treatment_id: treatmentId,
      created_at: new Date().toISOString()
    }));

    const { error: treatmentError } = await supabase
      .from('appointment_treatments')
      .insert(treatmentData);

    if (treatmentError) {
      console.error('Failed to add treatments to appointment:', treatmentError);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Appointment created successfully',
    data: appointment
  });
});

export const getAppointments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'appointment_date',
    sortOrder = 'desc',
    status,
    patientId,
    dentistId,
    dateFrom,
    dateTo
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('appointments')
    .select(`
      *,
      patients!inner(first_name, last_name, patient_number, phone, email)
    `, { count: 'exact' })
    .eq('clinic_id', clinicId);

  // Apply filters
  if (search) {
    query = query.or(`patients.first_name.ilike.%${search}%,patients.last_name.ilike.%${search}%,patients.patient_number.ilike.%${search}%`);
  }

  if (status) {
    query = query.eq('status', status);
  }

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  if (dentistId) {
    query = query.eq('dentist_id', dentistId);
  }

  if (dateFrom) {
    query = query.gte('appointment_date', dateFrom);
  }

  if (dateTo) {
    query = query.lte('appointment_date', dateTo);
  }

  // Apply sorting
  query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: appointments, error, count } = await query;

  if (error) {
    throw new CustomError('Failed to fetch appointments', 400);
  }

  const totalPages = Math.ceil((count || 0) / Number(limit));

  const response: PaginatedResponse<Appointment> = {
    success: true,
    message: 'Appointments retrieved successfully',
    data: appointments || [],
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

export const getAppointmentById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  let query = supabase
    .from('appointments')
    .select(`
      *,
      patients!inner(first_name, last_name, patient_number, phone, email, medical_history, allergies),
      appointment_treatments!left(
        id,
        quantity,
        price,
        notes,
        treatments!inner(name, description, price)
      )
    `)
    .eq('id', id)
    .eq('clinic_id', clinicId);

  // If patient role, only allow viewing their own appointments
  if (req.user!.role === 'patient') {
    // Get patient record for this user
    const { data: patientRecord } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', req.user!.id)
      .eq('clinic_id', clinicId)
      .single();

    if (!patientRecord) {
      throw new CustomError('Patient record not found', 404);
    }

    query = query.eq('patient_id', patientRecord.id);
  }

  const { data: appointment, error } = await query.single();

  if (error || !appointment) {
    throw new CustomError('Appointment not found', 404);
  }

  res.json({
    success: true,
    message: 'Appointment retrieved successfully',
    data: appointment
  });
});

export const updateAppointment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const updateData = req.body;

  // Check if appointment exists
  const { data: existingAppointment, error: fetchError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingAppointment) {
    throw new CustomError('Appointment not found', 404);
  }

  // Check for conflicts if date/time is being updated
  if (updateData.appointmentDate || updateData.appointmentTime || updateData.durationMinutes) {
    const newDate = updateData.appointmentDate || existingAppointment.appointment_date;
    const newTime = updateData.appointmentTime || existingAppointment.appointment_time;
    const newDuration = updateData.durationMinutes || existingAppointment.duration_minutes || 60;

    const appointmentDateTime = new Date(`${newDate}T${newTime}`);
    const endDateTime = new Date(appointmentDateTime.getTime() + newDuration * 60000);

    const { data: conflicts } = await supabase
      .from('appointments')
      .select('id, appointment_date, appointment_time, duration_minutes')
      .eq('clinic_id', clinicId)
      .eq('appointment_date', newDate)
      .neq('id', id)
      .neq('status', 'cancelled');

    if (conflicts) {
      for (const conflict of conflicts) {
        const conflictStart = new Date(`${conflict.appointment_date}T${conflict.appointment_time}`);
        const conflictEnd = new Date(conflictStart.getTime() + (conflict.duration_minutes || 60) * 60000);

        if (
          (appointmentDateTime >= conflictStart && appointmentDateTime < conflictEnd) ||
          (endDateTime > conflictStart && endDateTime <= conflictEnd) ||
          (appointmentDateTime <= conflictStart && endDateTime >= conflictEnd)
        ) {
          throw new CustomError('Appointment time conflicts with existing appointment', 409);
        }
      }
    }
  }

  // Prepare update data
  const appointmentUpdateData = {
    patient_id: updateData.patientId,
    dentist_id: updateData.dentistId,
    appointment_date: updateData.appointmentDate,
    appointment_time: updateData.appointmentTime,
    duration_minutes: updateData.durationMinutes,
    status: updateData.status,
    notes: updateData.notes,
    diagnosis: updateData.diagnosis,
    treatment_plan: updateData.treatmentPlan,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(appointmentUpdateData).forEach(key => {
    if (appointmentUpdateData[key as keyof typeof appointmentUpdateData] === undefined) {
      delete appointmentUpdateData[key as keyof typeof appointmentUpdateData];
    }
  });

  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(appointmentUpdateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update appointment', 400);
  }

  // Update treatments if provided
  if (updateData.treatmentIds) {
    // Remove existing treatments
    await supabase
      .from('appointment_treatments')
      .delete()
      .eq('appointment_id', id);

    // Add new treatments
    if (updateData.treatmentIds.length > 0) {
      const treatmentData = updateData.treatmentIds.map((treatmentId: string) => ({
        appointment_id: id,
        treatment_id: treatmentId,
        created_at: new Date().toISOString()
      }));

      const { error: treatmentError } = await supabase
        .from('appointment_treatments')
        .insert(treatmentData);

      if (treatmentError) {
        console.error('Failed to update appointment treatments:', treatmentError);
      }
    }
  }

  res.json({
    success: true,
    message: 'Appointment updated successfully',
    data: appointment
  });
});

export const deleteAppointment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Check if appointment exists
  const { data: existingAppointment, error: fetchError } = await supabase
    .from('appointments')
    .select('id, status')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingAppointment) {
    throw new CustomError('Appointment not found', 404);
  }

  // Don't allow deletion of completed appointments
  if (existingAppointment.status === 'completed') {
    throw new CustomError('Cannot delete completed appointments', 400);
  }

  // Delete appointment treatments first
  await supabase
    .from('appointment_treatments')
    .delete()
    .eq('appointment_id', id);

  // Delete appointment
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId);

  if (error) {
    throw new CustomError('Failed to delete appointment', 400);
  }

  res.json({
    success: true,
    message: 'Appointment deleted successfully'
  });
});

export const updateAppointmentStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const { status, notes } = req.body;

  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };

  if (notes) {
    updateData.notes = notes;
  }

  const { data: appointment, error } = await supabase
    .from('appointments')
    .update(updateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error || !appointment) {
    throw new CustomError('Failed to update appointment status', 400);
  }

  res.json({
    success: true,
    message: 'Appointment status updated successfully',
    data: appointment
  });
});

export const getMyAppointments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const userId = req.user!.id;

  // Get patient record for this user
  const { data: patientRecord, error: patientError } = await supabase
    .from('patients')
    .select('id')
    .eq('user_id', userId)
    .eq('clinic_id', clinicId)
    .single();

  if (patientError || !patientRecord) {
    throw new CustomError('Patient record not found', 404);
  }

  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      *,
      appointment_treatments!left(
        id,
        quantity,
        price,
        notes,
        treatments!inner(name, description, price)
      )
    `)
    .eq('patient_id', patientRecord.id)
    .eq('clinic_id', clinicId)
    .order('appointment_date', { ascending: false });

  if (error) {
    throw new CustomError('Failed to fetch appointments', 400);
  }

  res.json({
    success: true,
    message: 'Appointments retrieved successfully',
    data: appointments || []
  });
});

export const bookAppointment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // This endpoint is for public appointment booking from the website
  // It creates a patient record if needed and schedules the appointment
  const {
    firstName,
    lastName,
    email,
    phone,
    appointmentDate,
    appointmentTime,
    service,
    notes
  } = req.body;

  // For now, we'll assume a default clinic - in production, this would be determined by subdomain or other means
  const defaultClinicId = process.env.DEFAULT_CLINIC_ID;
  
  if (!defaultClinicId) {
    throw new CustomError('Clinic configuration not found', 400);
  }

  // Check if patient exists
  let patient;
  const { data: existingPatient } = await supabase
    .from('patients')
    .select('id')
    .eq('email', email)
    .eq('clinic_id', defaultClinicId)
    .single();

  if (existingPatient) {
    patient = existingPatient;
  } else {
    // Create new patient
    const patientNumber = `P${Date.now().toString().slice(-6)}`;
    const { data: newPatient, error: patientError } = await supabase
      .from('patients')
      .insert([{
        clinic_id: defaultClinicId,
        patient_number: patientNumber,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (patientError || !newPatient) {
      throw new CustomError('Failed to create patient record', 400);
    }

    patient = newPatient;
  }

  // Create appointment
  const appointmentData = {
    clinic_id: defaultClinicId,
    patient_id: patient.id,
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    duration_minutes: 60,
    status: 'scheduled' as const,
    notes: `Service: ${service}\nNotes: ${notes || 'N/A'}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([appointmentData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to book appointment', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: {
      appointmentId: appointment.id,
      patientId: patient.id,
      appointmentDate,
      appointmentTime,
      status: 'scheduled'
    }
  });
});
