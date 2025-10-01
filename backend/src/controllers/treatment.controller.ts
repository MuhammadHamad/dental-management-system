import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, Treatment, PaginatedResponse } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';

export const createTreatment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { name, description, durationMinutes, price, isActive = true } = req.body;

  // Check if treatment with same name already exists for this clinic
  const { data: existingTreatment } = await supabase
    .from('treatments')
    .select('id')
    .eq('clinic_id', clinicId)
    .eq('name', name)
    .single();

  if (existingTreatment) {
    throw new CustomError('Treatment with this name already exists', 409);
  }

  const treatmentData = {
    clinic_id: clinicId,
    name,
    description,
    duration_minutes: durationMinutes,
    price,
    is_active: isActive,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: treatment, error } = await supabase
    .from('treatments')
    .insert([treatmentData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to create treatment', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Treatment created successfully',
    data: treatment
  });
});

export const getTreatments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    isActive,
    minPrice,
    maxPrice
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('treatments')
    .select('*', { count: 'exact' })
    .eq('clinic_id', clinicId);

  // Apply filters
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (isActive !== undefined) {
    query = query.eq('is_active', isActive === 'true');
  }

  if (minPrice !== undefined) {
    query = query.gte('price', Number(minPrice));
  }

  if (maxPrice !== undefined) {
    query = query.lte('price', Number(maxPrice));
  }

  // Apply sorting
  query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: treatments, error, count } = await query;

  if (error) {
    throw new CustomError('Failed to fetch treatments', 400);
  }

  const totalPages = Math.ceil((count || 0) / Number(limit));

  const response: PaginatedResponse<Treatment> = {
    success: true,
    message: 'Treatments retrieved successfully',
    data: treatments || [],
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

export const getTreatmentById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  const { data: treatment, error } = await supabase
    .from('treatments')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (error || !treatment) {
    throw new CustomError('Treatment not found', 404);
  }

  res.json({
    success: true,
    message: 'Treatment retrieved successfully',
    data: treatment
  });
});

export const updateTreatment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const updateData = req.body;

  // Check if treatment exists
  const { data: existingTreatment, error: fetchError } = await supabase
    .from('treatments')
    .select('id, name')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingTreatment) {
    throw new CustomError('Treatment not found', 404);
  }

  // Check name uniqueness if name is being updated
  if (updateData.name && updateData.name !== existingTreatment.name) {
    const { data: nameCheck } = await supabase
      .from('treatments')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('name', updateData.name)
      .neq('id', id)
      .single();

    if (nameCheck) {
      throw new CustomError('Treatment with this name already exists', 409);
    }
  }

  // Prepare update data
  const treatmentUpdateData = {
    name: updateData.name,
    description: updateData.description,
    duration_minutes: updateData.durationMinutes,
    price: updateData.price,
    is_active: updateData.isActive,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(treatmentUpdateData).forEach(key => {
    if (treatmentUpdateData[key as keyof typeof treatmentUpdateData] === undefined) {
      delete treatmentUpdateData[key as keyof typeof treatmentUpdateData];
    }
  });

  const { data: treatment, error } = await supabase
    .from('treatments')
    .update(treatmentUpdateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update treatment', 400);
  }

  res.json({
    success: true,
    message: 'Treatment updated successfully',
    data: treatment
  });
});

export const deleteTreatment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Check if treatment exists
  const { data: existingTreatment, error: fetchError } = await supabase
    .from('treatments')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingTreatment) {
    throw new CustomError('Treatment not found', 404);
  }

  // Check if treatment is used in any appointments
  const { data: appointmentTreatments } = await supabase
    .from('appointment_treatments')
    .select('id')
    .eq('treatment_id', id)
    .limit(1);

  if (appointmentTreatments && appointmentTreatments.length > 0) {
    throw new CustomError('Cannot delete treatment that is used in appointments', 400);
  }

  const { error } = await supabase
    .from('treatments')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId);

  if (error) {
    throw new CustomError('Failed to delete treatment', 400);
  }

  res.json({
    success: true,
    message: 'Treatment deleted successfully'
  });
});
