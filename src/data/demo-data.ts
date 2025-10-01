// Demo data for testing and demonstration purposes
export const demoClinic = {
  id: 'demo-clinic-001',
  name: 'SmileCare Dental Clinic',
  address: '123 Healthcare Street, Medical District, Karachi, Pakistan',
  phone: '+92-21-1234567',
  email: 'info@smilecare.pk',
  website: 'https://smilecare.pk',
  description: 'Premier dental care facility providing comprehensive oral health services with state-of-the-art technology and experienced professionals.',
  established: '2020-01-15',
  services: [
    'General Dentistry',
    'Cosmetic Dentistry', 
    'Orthodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Periodontics',
    'Endodontics',
    'Prosthodontics'
  ]
};

export const demoAdminCredentials = {
  email: 'admin@smilecare.pk',
  password: 'Admin123!',
  firstName: 'Dr. Ahmed',
  lastName: 'Khan',
  role: 'admin'
};

export const demoPatientCredentials = {
  email: 'patient@example.com',
  password: 'Patient123!',
  firstName: 'Sarah',
  lastName: 'Ahmed',
  role: 'patient'
};

export const demoPatients = [
  {
    id: 'patient-001',
    patient_number: 'P000001',
    first_name: 'Sarah',
    last_name: 'Ahmed',
    date_of_birth: '1990-05-15',
    gender: 'female',
    phone: '+92-300-1234567',
    email: 'sarah.ahmed@example.com',
    address: '456 Residential Area, Block A, Lahore, Pakistan',
    emergency_contact_name: 'Ali Ahmed',
    emergency_contact_phone: '+92-300-7654321',
    medical_history: 'No significant medical history. Regular dental checkups.',
    allergies: 'None known',
    insurance_provider: 'State Life Insurance',
    insurance_number: 'SLI-2024-001'
  },
  {
    id: 'patient-002',
    patient_number: 'P000002',
    first_name: 'Muhammad',
    last_name: 'Hassan',
    date_of_birth: '1985-12-03',
    gender: 'male',
    phone: '+92-321-9876543',
    email: 'hassan.m@example.com',
    address: '789 Business District, Islamabad, Pakistan',
    emergency_contact_name: 'Fatima Hassan',
    emergency_contact_phone: '+92-321-1111111',
    medical_history: 'Diabetes Type 2, controlled with medication.',
    allergies: 'Penicillin',
    insurance_provider: 'Adamjee Insurance',
    insurance_number: 'AJI-2024-002'
  },
  {
    id: 'patient-003',
    patient_number: 'P000003',
    first_name: 'Ayesha',
    last_name: 'Khan',
    date_of_birth: '1995-08-22',
    gender: 'female',
    phone: '+92-333-5555555',
    email: 'ayesha.khan@example.com',
    address: '321 University Town, Peshawar, Pakistan',
    emergency_contact_name: 'Omar Khan',
    emergency_contact_phone: '+92-333-6666666',
    medical_history: 'Hypertension, regular medication.',
    allergies: 'Latex',
    insurance_provider: 'EFU Life Insurance',
    insurance_number: 'EFU-2024-003'
  },
  {
    id: 'patient-004',
    patient_number: 'P000004',
    first_name: 'Ali',
    last_name: 'Raza',
    date_of_birth: '1988-03-10',
    gender: 'male',
    phone: '+92-345-7777777',
    email: 'ali.raza@example.com',
    address: '654 Industrial Area, Faisalabad, Pakistan',
    emergency_contact_name: 'Zainab Raza',
    emergency_contact_phone: '+92-345-8888888',
    medical_history: 'No significant medical history.',
    allergies: 'None known',
    insurance_provider: 'Jubilee Life Insurance',
    insurance_number: 'JLI-2024-004'
  },
  {
    id: 'patient-005',
    patient_number: 'P000005',
    first_name: 'Fatima',
    last_name: 'Malik',
    date_of_birth: '1992-11-18',
    gender: 'female',
    phone: '+92-301-2222222',
    email: 'fatima.malik@example.com',
    address: '987 Garden Town, Multan, Pakistan',
    emergency_contact_name: 'Usman Malik',
    emergency_contact_phone: '+92-301-3333333',
    medical_history: 'Asthma, uses inhaler as needed.',
    allergies: 'Dust, pollen',
    insurance_provider: 'TPL Insurance',
    insurance_number: 'TPL-2024-005'
  }
];

export const demoTreatments = [
  {
    id: 'treatment-001',
    name: 'General Checkup & Cleaning',
    description: 'Comprehensive oral examination with professional teeth cleaning',
    duration_minutes: 60,
    price: 3000,
    is_active: true
  },
  {
    id: 'treatment-002',
    name: 'Teeth Whitening',
    description: 'Professional teeth whitening treatment for brighter smile',
    duration_minutes: 90,
    price: 15000,
    is_active: true
  },
  {
    id: 'treatment-003',
    name: 'Dental Filling',
    description: 'Composite or amalgam filling for cavity treatment',
    duration_minutes: 45,
    price: 5000,
    is_active: true
  },
  {
    id: 'treatment-004',
    name: 'Root Canal Treatment',
    description: 'Endodontic treatment to save infected tooth',
    duration_minutes: 120,
    price: 25000,
    is_active: true
  },
  {
    id: 'treatment-005',
    name: 'Tooth Extraction',
    description: 'Simple or surgical tooth extraction',
    duration_minutes: 30,
    price: 4000,
    is_active: true
  },
  {
    id: 'treatment-006',
    name: 'Dental Crown',
    description: 'Porcelain or metal crown placement',
    duration_minutes: 90,
    price: 20000,
    is_active: true
  },
  {
    id: 'treatment-007',
    name: 'Orthodontic Consultation',
    description: 'Initial consultation for braces or aligners',
    duration_minutes: 45,
    price: 2000,
    is_active: true
  },
  {
    id: 'treatment-008',
    name: 'Dental Implant',
    description: 'Single tooth implant with crown',
    duration_minutes: 180,
    price: 80000,
    is_active: true
  }
];

export const demoAppointments = [
  {
    id: 'appointment-001',
    patient_id: 'patient-001',
    appointment_date: '2024-01-20',
    appointment_time: '09:00',
    duration_minutes: 60,
    status: 'confirmed',
    notes: 'Regular checkup and cleaning',
    diagnosis: '',
    treatment_plan: ''
  },
  {
    id: 'appointment-002',
    patient_id: 'patient-002',
    appointment_date: '2024-01-20',
    appointment_time: '10:30',
    duration_minutes: 45,
    status: 'scheduled',
    notes: 'Tooth pain, possible cavity',
    diagnosis: '',
    treatment_plan: ''
  },
  {
    id: 'appointment-003',
    patient_id: 'patient-003',
    appointment_date: '2024-01-21',
    appointment_time: '14:00',
    duration_minutes: 90,
    status: 'confirmed',
    notes: 'Teeth whitening consultation',
    diagnosis: '',
    treatment_plan: ''
  },
  {
    id: 'appointment-004',
    patient_id: 'patient-004',
    appointment_date: '2024-01-22',
    appointment_time: '11:00',
    duration_minutes: 120,
    status: 'completed',
    notes: 'Root canal treatment',
    diagnosis: 'Infected pulp in tooth #14',
    treatment_plan: 'Root canal therapy completed successfully'
  },
  {
    id: 'appointment-005',
    patient_id: 'patient-005',
    appointment_date: '2024-01-23',
    appointment_time: '15:30',
    duration_minutes: 60,
    status: 'confirmed',
    notes: 'Follow-up after filling',
    diagnosis: '',
    treatment_plan: ''
  }
];

export const demoInventory = [
  {
    id: 'inventory-001',
    item_name: 'Dental Gloves (Nitrile)',
    category: 'PPE',
    brand: 'MedGlove',
    supplier: 'Dental Supply Co.',
    current_stock: 250,
    minimum_stock: 100,
    unit_cost: 15,
    expiry_date: '2025-06-30',
    notes: 'Size Medium, Powder-free'
  },
  {
    id: 'inventory-002',
    item_name: 'Composite Filling Material',
    category: 'Restorative',
    brand: '3M ESPE',
    supplier: 'Dental Materials Inc.',
    current_stock: 15,
    minimum_stock: 20,
    unit_cost: 4599,
    expiry_date: '2024-12-31',
    notes: 'Shade A2, 4g syringes'
  },
  {
    id: 'inventory-003',
    item_name: 'Disposable Face Masks',
    category: 'PPE',
    brand: 'SafeMed',
    supplier: 'Medical Supplies Ltd.',
    current_stock: 500,
    minimum_stock: 200,
    unit_cost: 25,
    expiry_date: '2026-01-15',
    notes: 'Level 2 surgical masks'
  },
  {
    id: 'inventory-004',
    item_name: 'Local Anesthetic (Lidocaine)',
    category: 'Pharmaceuticals',
    brand: 'Septodont',
    supplier: 'Pharma Dental',
    current_stock: 8,
    minimum_stock: 15,
    unit_cost: 1250,
    expiry_date: '2024-08-30',
    notes: '2% with epinephrine, 1.8ml cartridges'
  },
  {
    id: 'inventory-005',
    item_name: 'Dental Burs (Diamond)',
    category: 'Instruments',
    brand: 'Komet',
    supplier: 'Instrument Supply Co.',
    current_stock: 45,
    minimum_stock: 30,
    unit_cost: 875,
    notes: 'Assorted grits, FG shank'
  }
];

export const demoTransactions = [
  {
    id: 'transaction-001',
    transaction_type: 'payment',
    payment_method: 'cash',
    amount: 3000,
    description: 'General Checkup and Cleaning',
    transaction_date: '2024-01-15',
    patient_id: 'patient-001',
    appointment_id: 'appointment-001',
    notes: 'Cash payment received'
  },
  {
    id: 'transaction-002',
    transaction_type: 'payment',
    payment_method: 'easypaisa',
    amount: 15000,
    description: 'Teeth Whitening Treatment',
    transaction_date: '2024-01-16',
    reference_number: 'EP123456789',
    patient_id: 'patient-003',
    notes: 'EasyPaisa mobile payment'
  },
  {
    id: 'transaction-003',
    transaction_type: 'expense',
    payment_method: 'bank_transfer',
    amount: 45000,
    description: 'Monthly Dental Supplies Purchase',
    transaction_date: '2024-01-10',
    reference_number: 'BT987654321',
    notes: 'Inventory restocking'
  },
  {
    id: 'transaction-004',
    transaction_type: 'payment',
    payment_method: 'jazzcash',
    amount: 25000,
    description: 'Root Canal Treatment',
    transaction_date: '2024-01-18',
    reference_number: 'JC456789123',
    patient_id: 'patient-004',
    appointment_id: 'appointment-004',
    notes: 'JazzCash mobile payment'
  },
  {
    id: 'transaction-005',
    transaction_type: 'payment',
    payment_method: 'insurance',
    amount: 20000,
    description: 'Dental Crown - Insurance Coverage',
    transaction_date: '2024-01-19',
    reference_number: 'INS-2024-001',
    patient_id: 'patient-002',
    notes: 'Insurance claim processed'
  }
];

export const demoCredentials = {
  admin: demoAdminCredentials,
  patient: demoPatientCredentials
};

export const allDemoData = {
  clinic: demoClinic,
  patients: demoPatients,
  treatments: demoTreatments,
  appointments: demoAppointments,
  inventory: demoInventory,
  transactions: demoTransactions,
  credentials: demoCredentials
};
