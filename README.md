# SmileCare Dental Management System

A modern, comprehensive dental clinic management system built with React, TypeScript, and Supabase. Designed for SmileCare Dental Clinic to streamline operations, manage patients, schedule appointments, and track inventory.

## 🏥 About SmileCare Dental Clinic

**SmileCare Dental Clinic** - Your Smile, Our Priority

- **Address**: 123 Healthcare Avenue, Lahore, Punjab 54000, Pakistan
- **Phone**: +92-42-1234-5678
- **Mobile**: +92-300-1234567
- **Email**: info@smilecare.com
- **Website**: https://smilecare.com

### Business Hours
- **Monday - Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 9:00 AM - 2:00 PM
- **Sunday**: Closed

## 🚀 Features

### For Patients
- **Online Appointment Booking**: Schedule appointments 24/7
- **Patient Dashboard**: View appointments and medical history
- **Treatment Information**: Detailed service catalog with pricing
- **Contact & Directions**: Easy access to clinic information

### For Clinic Staff (Admin)
- **Patient Management**: Complete CRUD operations for patient records
- **Appointment Scheduling**: Advanced scheduling with conflict detection
- **Inventory Management**: Track supplies with low stock alerts
- **Financial Tracking**: Transaction management with multiple payment methods
- **Dashboard Analytics**: Real-time insights and statistics

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom healthcare design system
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: TanStack React Query + React Context
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form + Zod validation

## 🏗️ Project Structure

```
dental-management-system/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   │   ├── public/         # Public pages (Home, Services, About, Contact, BookAppointment)
│   │   ├── admin/          # Admin dashboard pages
│   │   └── patient/        # Patient dashboard
│   ├── hooks/              # Custom React hooks
│   ├── config/             # Configuration files
│   └── integrations/       # External service integrations
├── supabase/               # Database migrations and configuration
└── public/                 # Static assets
```

### Security & Authentication
- JWT-based authentication
- Row Level Security (RLS)
- Input validation and sanitization
- Rate limiting and CORS protection

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/dental-management-system.git
cd dental-management-system
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/66aee347-94bb-4aac-96fd-5a5ecda79876) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
