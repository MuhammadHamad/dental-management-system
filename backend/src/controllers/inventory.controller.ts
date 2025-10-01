import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest, InventoryItem, PaginatedResponse } from '../types';
import { asyncHandler, CustomError } from '../middleware/error.middleware';
import { addDays, isBefore, parseISO } from 'date-fns';

export const createInventoryItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    itemName,
    category,
    brand,
    supplier,
    currentStock,
    minimumStock,
    unitCost,
    expiryDate,
    notes
  } = req.body;

  // Check if item with same name already exists for this clinic
  const { data: existingItem } = await supabase
    .from('inventory')
    .select('id')
    .eq('clinic_id', clinicId)
    .eq('item_name', itemName)
    .single();

  if (existingItem) {
    throw new CustomError('Inventory item with this name already exists', 409);
  }

  const inventoryData = {
    clinic_id: clinicId,
    item_name: itemName,
    category,
    brand,
    supplier,
    current_stock: currentStock,
    minimum_stock: minimumStock,
    unit_cost: unitCost,
    expiry_date: expiryDate,
    notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data: inventoryItem, error } = await supabase
    .from('inventory')
    .insert([inventoryData])
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to create inventory item', 400);
  }

  res.status(201).json({
    success: true,
    message: 'Inventory item created successfully',
    data: inventoryItem
  });
});

export const getInventoryItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const {
    page = 1,
    limit = 10,
    search = '',
    sortBy = 'created_at',
    sortOrder = 'desc',
    category,
    lowStock,
    expiringSoon,
    brand,
    supplier
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase
    .from('inventory')
    .select('*', { count: 'exact' })
    .eq('clinic_id', clinicId);

  // Apply filters
  if (search) {
    query = query.or(`item_name.ilike.%${search}%,category.ilike.%${search}%,brand.ilike.%${search}%,supplier.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  if (brand) {
    query = query.eq('brand', brand);
  }

  if (supplier) {
    query = query.eq('supplier', supplier);
  }

  // Apply sorting
  query = query.order(String(sortBy), { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + Number(limit) - 1);

  const { data: inventoryItems, error, count } = await query;

  if (error) {
    throw new CustomError('Failed to fetch inventory items', 400);
  }

  let filteredItems = inventoryItems || [];

  // Apply post-query filters
  if (lowStock === 'true') {
    filteredItems = filteredItems.filter(item => item.current_stock <= item.minimum_stock);
  }

  if (expiringSoon === 'true') {
    const thirtyDaysFromNow = addDays(new Date(), 30);
    filteredItems = filteredItems.filter(item => 
      item.expiry_date && isBefore(parseISO(item.expiry_date), thirtyDaysFromNow)
    );
  }

  const totalPages = Math.ceil((count || 0) / Number(limit));

  const response: PaginatedResponse<InventoryItem> = {
    success: true,
    message: 'Inventory items retrieved successfully',
    data: filteredItems,
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

export const getInventoryItemById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  const { data: inventoryItem, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (error || !inventoryItem) {
    throw new CustomError('Inventory item not found', 404);
  }

  res.json({
    success: true,
    message: 'Inventory item retrieved successfully',
    data: inventoryItem
  });
});

export const updateInventoryItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const updateData = req.body;

  // Check if item exists
  const { data: existingItem, error: fetchError } = await supabase
    .from('inventory')
    .select('id, item_name')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingItem) {
    throw new CustomError('Inventory item not found', 404);
  }

  // Check name uniqueness if name is being updated
  if (updateData.itemName && updateData.itemName !== existingItem.item_name) {
    const { data: nameCheck } = await supabase
      .from('inventory')
      .select('id')
      .eq('clinic_id', clinicId)
      .eq('item_name', updateData.itemName)
      .neq('id', id)
      .single();

    if (nameCheck) {
      throw new CustomError('Inventory item with this name already exists', 409);
    }
  }

  // Prepare update data
  const inventoryUpdateData = {
    item_name: updateData.itemName,
    category: updateData.category,
    brand: updateData.brand,
    supplier: updateData.supplier,
    current_stock: updateData.currentStock,
    minimum_stock: updateData.minimumStock,
    unit_cost: updateData.unitCost,
    expiry_date: updateData.expiryDate,
    notes: updateData.notes,
    updated_at: new Date().toISOString()
  };

  // Remove undefined values
  Object.keys(inventoryUpdateData).forEach(key => {
    if (inventoryUpdateData[key as keyof typeof inventoryUpdateData] === undefined) {
      delete inventoryUpdateData[key as keyof typeof inventoryUpdateData];
    }
  });

  const { data: inventoryItem, error } = await supabase
    .from('inventory')
    .update(inventoryUpdateData)
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update inventory item', 400);
  }

  res.json({
    success: true,
    message: 'Inventory item updated successfully',
    data: inventoryItem
  });
});

export const updateStock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;
  const { quantity, type, notes } = req.body;

  // Get current item
  const { data: currentItem, error: fetchError } = await supabase
    .from('inventory')
    .select('current_stock')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !currentItem) {
    throw new CustomError('Inventory item not found', 404);
  }

  let newStock: number;
  
  switch (type) {
    case 'add':
      newStock = currentItem.current_stock + quantity;
      break;
    case 'subtract':
      newStock = Math.max(0, currentItem.current_stock - quantity);
      break;
    case 'set':
      newStock = quantity;
      break;
    default:
      throw new CustomError('Invalid stock update type', 400);
  }

  const { data: inventoryItem, error } = await supabase
    .from('inventory')
    .update({
      current_stock: newStock,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .select()
    .single();

  if (error) {
    throw new CustomError('Failed to update stock', 400);
  }

  res.json({
    success: true,
    message: 'Stock updated successfully',
    data: {
      ...inventoryItem,
      stockChange: {
        type,
        quantity,
        previousStock: currentItem.current_stock,
        newStock,
        notes
      }
    }
  });
});

export const deleteInventoryItem = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { id } = req.params;

  // Check if item exists
  const { data: existingItem, error: fetchError } = await supabase
    .from('inventory')
    .select('id')
    .eq('id', id)
    .eq('clinic_id', clinicId)
    .single();

  if (fetchError || !existingItem) {
    throw new CustomError('Inventory item not found', 404);
  }

  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)
    .eq('clinic_id', clinicId);

  if (error) {
    throw new CustomError('Failed to delete inventory item', 400);
  }

  res.json({
    success: true,
    message: 'Inventory item deleted successfully'
  });
});

export const getLowStockItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;

  const { data: lowStockItems, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('clinic_id', clinicId)
    .filter('current_stock', 'lte', 'minimum_stock')
    .order('current_stock', { ascending: true });

  if (error) {
    throw new CustomError('Failed to fetch low stock items', 400);
  }

  res.json({
    success: true,
    message: 'Low stock items retrieved successfully',
    data: lowStockItems || []
  });
});

export const getExpiringItems = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;
  const { days = 30 } = req.query;

  const expiryDate = addDays(new Date(), Number(days)).toISOString().split('T')[0];

  const { data: expiringItems, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('clinic_id', clinicId)
    .not('expiry_date', 'is', null)
    .lte('expiry_date', expiryDate)
    .order('expiry_date', { ascending: true });

  if (error) {
    throw new CustomError('Failed to fetch expiring items', 400);
  }

  res.json({
    success: true,
    message: 'Expiring items retrieved successfully',
    data: expiringItems || []
  });
});

export const getCategories = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const clinicId = req.user!.clinic_id;

  const { data: categories, error } = await supabase
    .from('inventory')
    .select('category')
    .eq('clinic_id', clinicId)
    .order('category');

  if (error) {
    throw new CustomError('Failed to fetch categories', 400);
  }

  // Get unique categories
  const uniqueCategories = [...new Set(categories?.map(item => item.category) || [])];

  res.json({
    success: true,
    message: 'Categories retrieved successfully',
    data: uniqueCategories
  });
});
