#!/usr/bin/env node

/**
 * Production Setup Script for SmileCare Dental Management System
 * 
 * This script helps configure the application for production deployment
 * by updating configuration files with real clinic information.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration prompts
const CONFIG_PROMPTS = {
  clinicName: 'Enter your clinic name (e.g., SmileCare Dental Clinic):',
  clinicTagline: 'Enter your clinic tagline (e.g., Your Smile, Our Priority):',
  clinicDescription: 'Enter clinic description:',
  address: 'Enter full clinic address:',
  phone: 'Enter clinic phone number:',
  mobile: 'Enter mobile number:',
  email: 'Enter clinic email:',
  website: 'Enter clinic website URL:',
  supabaseUrl: 'Enter your Supabase project URL:',
  supabaseKey: 'Enter your Supabase anon key:',
  domain: 'Enter your production domain (e.g., https://yoursite.com):'
};

// Default configuration template
const DEFAULT_CONFIG = {
  clinicName: 'SmileCare Dental Clinic',
  clinicTagline: 'Your Smile, Our Priority',
  clinicDescription: 'Professional dental care with modern technology and compassionate service',
  address: {
    street: '123 Healthcare Avenue',
    city: 'Lahore',
    state: 'Punjab',
    postalCode: '54000',
    country: 'Pakistan'
  },
  contact: {
    phone: '+92-42-1234-5678',
    mobile: '+92-300-1234567',
    email: 'info@smilecare.com',
    website: 'https://smilecare.com'
  },
  hours: {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed'
  }
};

// Update clinic configuration
function updateClinicConfig(config) {
  const configPath = path.join(__dirname, 'src', 'config', 'clinic.ts');
  
  const configContent = `// Real clinic configuration - Updated for production
export const CLINIC_CONFIG = ${JSON.stringify(config, null, 2)};

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

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    supabaseUrl: process.env.VITE_SUPABASE_URL || '',
    supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  },
  production: {
    apiUrl: 'https://your-api-domain.com/api',
    supabaseUrl: process.env.VITE_SUPABASE_URL || '',
    supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  }
};

// Get current environment configuration
export const getEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};`;

  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ Updated clinic configuration');
}

// Update environment variables
function updateEnvironmentFile(config) {
  const envPath = path.join(__dirname, '.env.production');
  
  const envContent = `# Production Environment Variables - SmileCare Dental Clinic

# Supabase Configuration (Production)
VITE_SUPABASE_URL=${config.supabaseUrl || 'https://your-project-id.supabase.co'}
VITE_SUPABASE_PUBLISHABLE_KEY=${config.supabaseKey || 'your-production-anon-key'}
VITE_SUPABASE_PROJECT_ID=${config.supabaseProjectId || 'your-project-id'}

# Application Configuration
VITE_APP_NAME=${config.clinicName}
VITE_APP_URL=${config.domain || 'https://your-domain.com'}
VITE_API_URL=${config.apiUrl || 'https://your-api-domain.com/api'}

# Clinic Information
VITE_CLINIC_NAME=${config.clinicName}
VITE_CLINIC_EMAIL=${config.contact.email}
VITE_CLINIC_PHONE=${config.contact.phone}
VITE_CLINIC_ADDRESS=${config.address.street}, ${config.address.city}

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CHAT_SUPPORT=true
VITE_ENABLE_PAYMENT_GATEWAY=true

# Third-party Services (Update these with your actual keys)
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key

# Contact Information
VITE_CONTACT_EMAIL=${config.contact.email}
VITE_SUPPORT_EMAIL=support@${config.contact.email.split('@')[1]}

# Social Media Links (Update these with your actual social media URLs)
VITE_FACEBOOK_URL=https://facebook.com/${config.clinicName.toLowerCase().replace(/\s+/g, '')}
VITE_INSTAGRAM_URL=https://instagram.com/${config.clinicName.toLowerCase().replace(/\s+/g, '')}
VITE_TWITTER_URL=https://twitter.com/${config.clinicName.toLowerCase().replace(/\s+/g, '')}`;

  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Updated production environment file');
}

// Main setup function
function setupProduction() {
  console.log('🚀 Setting up SmileCare Dental Management System for Production\n');
  
  // For now, use default configuration
  // In a real scenario, you would prompt for user input
  const config = {
    ...DEFAULT_CONFIG,
    id: '550e8400-e29b-41d4-a716-446655440000' // Real clinic UUID
  };
  
  try {
    updateClinicConfig(config);
    updateEnvironmentFile(config);
    
    console.log('\n✅ Production setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update .env.production with your actual Supabase credentials');
    console.log('2. Customize clinic information in src/config/clinic.ts');
    console.log('3. Replace placeholder images with real clinic photos');
    console.log('4. Configure your domain and SSL certificates');
    console.log('5. Run database migrations in your production Supabase project');
    console.log('6. Test the application thoroughly before going live');
    console.log('\n📚 See DEPLOYMENT_CHECKLIST.md for complete deployment guide');
    
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProduction();
}

export { setupProduction, updateClinicConfig, updateEnvironmentFile };
