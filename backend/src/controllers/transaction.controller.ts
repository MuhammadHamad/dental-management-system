import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, Transaction, PaginatedResponse } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';

export const createTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    transactionType,
    paymentMethod,
    amount,
    description,
    transactionDate,
    referenceNumber,
    patientId,
    appointmentId,
    notes
  } = req.body;

  // Verify patient belongs to clinic if patientId is provided
  if (patientId) {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', patientId)
      .eq('clinic_id', clinicId)
      .single();

    if (patientError || !patient) {
      throw new CustomError('Patient not found', 404);
    }
  }

  // Verify appointment belongs to clinic if appointmentId is provided
  if (appointmentId) {
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('id', appointmentId)
      .eq('clinic_id', clinicId)
      .single();

    if (appointmentError || !appointment) {
      throw new CustomError('Appointment not found', 404);
    }
  }

  const transactionData = {
    clinic_id: clinicId,
    transaction_type: transactionType,
    payment_method: paymentMethod,
    amount,
    description,
    transaction_date: transactionDate,
    reference_number: referenceNumber,
    patient_id: patientId,
    appointment_id: appointmentId,
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: transaction, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to create transaction', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Transaction created successfully',
    data: transaction
  });
});

export const getTransactions = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'transaction_date',
    sortOrder = 'desc',
    transactionType,
    paymentMethod,
    patientId,
    appointmentId,
    dateFrom,
    dateTo,
    minAmount,
    maxAmount
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('transactions')
    .select(`
      *,
      patients(first_name, last_name, patient_number),
      appointments(appointment_date, appointment_time)
    `, { count: 'exact' })
    .eq('clinic_id', clinicId);

  // Apply filters
  if (search) {
    query = query.or(`description.ilike.%${search}%,reference_number.ilike.%${search}%,patients.first_name.ilike.%${search}%,patients.last_name.ilike.%${search}%`);
  }

  if (transactionType) {
    query = query.eq('transaction_type', transactionType);
  }

  if (paymentMethod) {
    query = query.eq('payment_method', paymentMethod);
  }

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  if (appointmentId) {
    query = query.eq('appointment_id', appointmentId);
  }

  if (dateFrom) {
    query = query.gte('transaction_date', dateFrom);
  }

  if (dateTo) {
    query = query.lte('transaction_date', dateTo);
  }

  if (minAmount) {
    query = query.gte('amount', Number(minAmount));
  }

  if (maxAmount) {
    query = query.lte('amount', Number(maxAmount));
  }

  // Apply sorting
  query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: transactions, error, count } = await query;

  if (error) {
    throw new CustomError('Failed to fetch transactions', 400);
  }

  const totalPages = Math.ceil((count || 0) / Number(limit));

  const response: PaginatedResponse<Transaction> = {
    success: true,
    message: 'Transactions retrieved successfully',
    data: transactions || [],
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

export const getTransactionById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  const { data: transaction, error } = await supabase
    .from('transactions')
    .select(`
      *,
      patients(first_name, last_name, patient_number, phone, email),
      appointments(appointment_date, appointment_time, status)
    `)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (error || !transaction) {
    throw new CustomError('Transaction not found', 404);
  }

  res.json({
    success: true,
    message: 'Transaction retrieved successfully',
    data: transaction
  });
});

export const updateTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const updateData = req.body;

  // Check if transaction exists
  const { data: existingTransaction, error: fetchError } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingTransaction) {
    throw new CustomError('Transaction not found', 404);
  }

  // Verify patient belongs to clinic if patientId is being updated
  if (updateData.patientId) {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('id', updateData.patientId)
      .eq('clinic_id', clinicId)
      .single();

    if (patientError || !patient) {
      throw new CustomError('Patient not found', 404);
    }
  }

  // Verify appointment belongs to clinic if appointmentId is being updated
  if (updateData.appointmentId) {
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select('id')
      .eq('id', updateData.appointmentId)
      .eq('clinic_id', clinicId)
      .single();

    if (appointmentError || !appointment) {
      throw new CustomError('Appointment not found', 404);
    }
  }

  // Prepare update data
  const transactionUpdateData = {
    transaction_type: updateData.transactionType,
    payment_method: updateData.paymentMethod,
    amount: updateData.amount,
    description: updateData.description,
    transaction_date: updateData.transactionDate,
    reference_number: updateData.referenceNumber,
    patient_id: updateData.patientId,
    appointment_id: updateData.appointmentId,
    notes: updateData.notes,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(transactionUpdateData).forEach(key => {
    if (transactionUpdateData[key as keyof typeof transactionUpdateData] === undefined) {
      delete transactionUpdateData[key as keyof typeof transactionUpdateData];
    }
  });

  const { data: transaction, error } = await supabase
    .from('transactions')
    .update(transactionUpdateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update transaction', 400);
  }

  res.json({
    success: true,
    message: 'Transaction updated successfully',
    data: transaction
  });
});

export const deleteTransaction = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Check if transaction exists
  const { data: existingTransaction, error: fetchError } = await supabase
    .from('transactions')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingTransaction) {
    throw new CustomError('Transaction not found', 404);
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId);

  if (error) {
    throw new CustomError('Failed to delete transaction', 400);
  }

  res.json({
    success: true,
    message: 'Transaction deleted successfully'
  });
});

export const getTransactionSummary = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { dateFrom, dateTo } = req.query;

  let query = supabase
    .from('transactions')
    .select('transaction_type, amount, payment_method')
    .eq('clinic_id', clinicId);

  if (dateFrom) {
    query = query.gte('transaction_date', dateFrom);
  }

  if (dateTo) {
    query = query.lte('transaction_date', dateTo);
  }

  const { data: transactions, error } = await query;

  if (error) {
    throw new CustomError('Failed to fetch transaction summary', 400);
  }

  // Calculate summary
  const summary = {
    totalPayments: 0,
    totalRefunds: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: transactions?.length || 0,
    paymentMethods: {} as Record<string, number>,
    transactionTypes: {} as Record<string, { count: number; amount: number }>
  };

  transactions?.forEach(transaction => {
    const amount = transaction.amount;
    const type = transaction.transaction_type;
    const method = transaction.payment_method;

    // Update totals
    switch (type) {
      case 'payment':
        summary.totalPayments += amount;
        break;
      case 'refund':
        summary.totalRefunds += amount;
        break;
      case 'expense':
        summary.totalExpenses += amount;
        break;
    }

    // Update payment methods
    summary.paymentMethods[method] = (summary.paymentMethods[method] || 0) + amount;

    // Update transaction types
    if (!summary.transactionTypes[type]) {
      summary.transactionTypes[type] = { count: 0, amount: 0 };
    }
    summary.transactionTypes[type].count++;
    summary.transactionTypes[type].amount += amount;
  });

  summary.netIncome = summary.totalPayments - summary.totalRefunds - summary.totalExpenses;

  res.json({
    success: true,
    message: 'Transaction summary retrieved successfully',
    data: summary
  });
});

export const getDailyReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { date = format(new Date(), 'yyyy-MM-dd') } = req.query;

  const startDate = startOfDay(new Date(String(date)));
  const endDate = endOfDay(new Date(String(date)));

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('clinic_id', clinicId)
    .gte('transaction_date', format(startDate, 'yyyy-MM-dd'))
    .lte('transaction_date', format(endDate, 'yyyy-MM-dd'))
    .order('transaction_date', { ascending: true });

  if (error) {
    throw new CustomError('Failed to fetch daily report', 400);
  }

  // Group by hour
  const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    payments: 0,
    expenses: 0,
    refunds: 0,
    count: 0
  }));

  transactions?.forEach(transaction => {
    const hour = new Date(transaction.created_at).getHours();
    const amount = transaction.amount;

    hourlyData[hour].count++;
    switch (transaction.transaction_type) {
      case 'payment':
        hourlyData[hour].payments += amount;
        break;
      case 'expense':
        hourlyData[hour].expenses += amount;
        break;
      case 'refund':
        hourlyData[hour].refunds += amount;
        break;
    }
  });

  res.json({
    success: true,
    message: 'Daily report retrieved successfully',
    data: {
      date: String(date),
      hourlyData,
      summary: {
        totalTransactions: transactions?.length || 0,
        totalPayments: transactions?.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0) || 0,
        totalExpenses: transactions?.filter(t => t.transaction_type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0,
        totalRefunds: transactions?.filter(t => t.transaction_type === 'refund').reduce((sum, t) => sum + t.amount, 0) || 0
      }
    }
  });
});

export const getMonthlyReport = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = req.query;

  const startDate = startOfMonth(new Date(Number(year), Number(month) - 1));
  const endDate = endOfMonth(new Date(Number(year), Number(month) - 1));

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('clinic_id', clinicId)
    .gte('transaction_date', format(startDate, 'yyyy-MM-dd'))
    .lte('transaction_date', format(endDate, 'yyyy-MM-dd'))
    .order('transaction_date', { ascending: true });

  if (error) {
    throw new CustomError('Failed to fetch monthly report', 400);
  }

  // Group by day
  const daysInMonth = endDate.getDate();
  const dailyData = Array.from({ length: daysInMonth }, (_, day) => ({
    day: day + 1,
    date: format(new Date(Number(year), Number(month) - 1, day + 1), 'yyyy-MM-dd'),
    payments: 0,
    expenses: 0,
    refunds: 0,
    count: 0
  }));

  transactions?.forEach(transaction => {
    const day = new Date(transaction.transaction_date).getDate() - 1;
    const amount = transaction.amount;

    if (day >= 0 && day < daysInMonth) {
      dailyData[day].count++;
      switch (transaction.transaction_type) {
        case 'payment':
          dailyData[day].payments += amount;
          break;
        case 'expense':
          dailyData[day].expenses += amount;
          break;
        case 'refund':
          dailyData[day].refunds += amount;
          break;
      }
    }
  });

  res.json({
    success: true,
    message: 'Monthly report retrieved successfully',
    data: {
      year: Number(year),
      month: Number(month),
      dailyData,
      summary: {
        totalTransactions: transactions?.length || 0,
        totalPayments: transactions?.filter(t => t.transaction_type === 'payment').reduce((sum, t) => sum + t.amount, 0) || 0,
        totalExpenses: transactions?.filter(t => t.transaction_type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0,
        totalRefunds: transactions?.filter(t => t.transaction_type === 'refund').reduce((sum, t) => sum + t.amount, 0) || 0
      }
    }
  });
});
