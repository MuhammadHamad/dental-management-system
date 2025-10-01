// Real clinic configuration - Update these values for your dental clinic

export const CLINIC_CONFIG = {
  // Clinic Information
  id: '550e8400-e29b-41d4-a716-446655440000', // Generate a new UUID for your clinic
  name: 'SmileCare Dental Clinic',
  tagline: 'Your Smile, Our Priority',
  description: 'Professional dental care with modern technology and compassionate service',
  
  // Contact Information
  address: {
    street: '123 Healthcare Avenue',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan',
    full: '123 Healthcare Avenue, Lahore, Punjab 54000, Pakistan'
  },
  
  contact: {
    phone: '+92-42-1234-5678',
    mobile: '+92-300-1234567',
    email: 'info@smilecare.com',
    website: 'https://smilecare.com'
  },
  
  // Business Hours
  hours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed'
  },
  
  // Services
  services: [
    'General Dentistry',
    'Preventive Care',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Root Canal Treatment',
    'Dental Implants',
    'Teeth Whitening'
  ],
  
  // Social Media
  social: {
    facebook: 'https://facebook.com/smilecare',
    instagram: 'https://instagram.com/smilecare',
    twitter: 'https://twitter.com/smilecare',
    linkedin: 'https://linkedin.com/company/smilecare'
  },
  
  // SEO & Marketing
  seo: {
    keywords: 'dental clinic, dentist, teeth cleaning, dental care, oral health, Lahore dentist',
    description: 'Professional dental care in Lahore. Expert dentists providing comprehensive oral health services with modern technology and compassionate care.'
  }
};

// Default treatments with realistic pricing (in PKR)
export const DEFAULT_TREATMENTS = [
  {
    name: 'General Consultation',
    description: 'Comprehensive dental examination and consultation',
    duration_minutes: 30,
    price: 2000
  },
  {
    name: 'Teeth Cleaning (Scaling)',
    description: 'Professional dental cleaning and plaque removal',
    duration_minutes: 45,
    price: 3500
  },
  {
    name: 'Dental Filling',
    description: 'Tooth-colored composite filling for cavities',
    duration_minutes: 60,
    price: 4500
  },
  {
    name: 'Root Canal Treatment',
    description: 'Complete root canal therapy for infected teeth',
    duration_minutes: 90,
    price: 15000
  },
  {
    name: 'Tooth Extraction',
    description: 'Simple tooth extraction procedure',
    duration_minutes: 30,
    price: 3000
  },
  {
    name: 'Teeth Whitening',
    description: 'Professional teeth whitening treatment',
    duration_minutes: 60,
    price: 8000
  },
  {
    name: 'Dental Crown',
    description: 'Ceramic or metal crown restoration',
    duration_minutes: 120,
    price: 25000
  },
  {
    name: 'Dental Implant',
    description: 'Single tooth implant with crown',
    duration_minutes: 180,
    price: 80000
  }
];

// Default inventory items
export const DEFAULT_INVENTORY = [
  {
    item_name: 'Disposable Gloves (Nitrile)',
    category: 'Safety Equipment',
    brand: 'MedGlove',
    supplier: 'Medical Supplies Co.',
    current_stock: 500,
    minimum_stock: 100,
    unit_cost: 15
  },
  {
    item_name: 'Dental Masks (3-Layer)',
    category: 'Safety Equipment',
    brand: 'SafeMask',
    supplier: 'Medical Supplies Co.',
    current_stock: 200,
    minimum_stock: 50,
    unit_cost: 8
  },
  {
    item_name: 'Composite Filling Material',
    category: 'Dental Materials',
    brand: '3M ESPE',
    supplier: 'Dental Supply House',
    current_stock: 25,
    minimum_stock: 5,
    unit_cost: 3500
  },
  {
    item_name: 'Local Anesthetic (Lidocaine)',
    category: 'Medications',
    brand: 'Septodont',
    supplier: 'Pharma Distributors',
    current_stock: 20,
    minimum_stock: 5,
    unit_cost: 450
  },
  {
    item_name: 'Dental Needles (27G)',
    category: 'Instruments',
    brand: 'Terumo',
    supplier: 'Medical Equipment Ltd.',
    current_stock: 100,
    minimum_stock: 25,
    unit_cost: 25
  }
];

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  },
  production: {
    apiUrl: 'https://your-api-domain.com/api', // Update with your production API URL
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  }
};

// Get current environment configuration
export const getEnvConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};
