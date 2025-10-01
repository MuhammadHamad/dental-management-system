# 🦷 DentalCare Pro - Complete Dental Management System

A comprehensive, production-ready dental practice management system built with modern web technologies. Designed specifically for dental clinics to manage patients, appointments, inventory, and financial transactions with a mobile-first approach.

![DentalCare Pro](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## 🌟 Key Features

### 🏥 **Multi-Tenant Architecture**
- Clinic-based data separation
- Secure multi-clinic support
- Role-based access control (Admin/Patient)

### 📱 **Mobile-First Responsive Design**
- Optimized for all devices (mobile, tablet, desktop)
- Touch-friendly interface
- Progressive Web App capabilities

### 👥 **Patient Management**
- Complete patient records with medical history
- Insurance information tracking
- Emergency contact management
- Auto-generated patient numbers

### 📅 **Appointment Scheduling**
- Conflict detection and prevention
- Multiple appointment statuses
- Public booking system
- Email notifications

### 📦 **Inventory Management**
- Stock level monitoring with alerts
- Expiry date tracking
- Category-based organization
- Supplier management

### 💰 **Financial Management**
- Multiple payment methods (Cash, Bank Transfer, Credit Card, EasyPaisa, JazzCash, Insurance)
- Transaction tracking and reporting
- Daily and monthly financial reports
- Pakistani payment gateway integration

### 🔐 **Security & Authentication**
- JWT-based authentication
- Row Level Security (RLS)
- Input validation and sanitization
- Rate limiting and CORS protection

## 🚀 Quick Start

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

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
```

### 4. Database Setup
1. Create a new Supabase project
2. Run the SQL migrations in `database/migrations/`
3. Enable Row Level Security (RLS) on all tables
4. Set up authentication policies

### 5. Start Development Servers
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🧪 Demo Credentials

### Admin Access
- **Email**: `admin@smilecare.pk`
- **Password**: `Admin123!`

### Patient Access  
- **Email**: `patient@example.com`
- **Password**: `Patient123!`

## 📱 Mobile Responsiveness

The system is built with a mobile-first approach:

- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+

- **Features**:
  - Collapsible sidebar navigation
  - Touch-optimized buttons and forms
  - Responsive data tables
  - Swipe gestures for mobile navigation

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **TanStack React Query** for state management
- **React Router DOM v6** for routing
- **React Hook Form + Zod** for form validation

### Backend Stack
- **Node.js + Express** with TypeScript
- **Supabase** for database and authentication
- **JWT** for token-based authentication
- **Joi** for input validation
- **Nodemailer** for email notifications
- **Rate limiting** and security middleware

### Database
- **PostgreSQL** via Supabase
- **Row Level Security (RLS)** enabled
- **Multi-tenant** data isolation
- **Real-time subscriptions** support

## 📊 Database Schema

```sql
-- Core Tables
clinics              -- Multi-tenant clinic information
profiles             -- Extended user profiles  
user_roles           -- Role-based access control
patients             -- Patient records with medical history
appointments         -- Appointment scheduling
treatments           -- Available dental services
appointment_treatments -- Many-to-many relationship
inventory            -- Supply management
transactions         -- Financial transactions
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/forgot-password` - Password reset
- `GET /api/auth/profile` - Get user profile

### Patients (Admin only)
- `GET /api/patients` - List patients (paginated)
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `PATCH /api/appointments/:id/status` - Update status
- `POST /api/appointments/book` - Public booking

### Inventory (Admin only)
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Create item
- `PATCH /api/inventory/:id/stock` - Update stock
- `GET /api/inventory/low-stock` - Low stock alerts

### Transactions (Admin only)
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/summary` - Financial summary
- `GET /api/transactions/reports/daily` - Daily reports

## 🎨 Design System

### Colors
- **Primary**: Medical Blue (#2563eb)
- **Secondary**: Clean White (#ffffff)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight

### Components
- **Buttons**: Medical, Hero, Success, Warning variants
- **Cards**: Consistent shadows and rounded corners
- **Forms**: Comprehensive validation and error states
- **Tables**: Responsive with pagination

## 🔒 Security Features

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Server-side validation with Joi
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for production domains
- **SQL Injection**: Protected via parameterized queries
- **XSS Protection**: Input sanitization
- **HTTPS**: SSL/TLS encryption in production

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Backend Deployment (Railway/Heroku)
```bash
# Build backend
cd backend
npm run build

# Deploy to Railway
railway up

# Deploy to Heroku
git push heroku main
```

### Environment Variables (Production)
```env
# Frontend (.env.production)
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_API_URL=your_backend_api_url

# Backend (.env)
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_strong_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

## 🧪 Testing

### Manual Testing Checklist

#### Public Website
- [ ] Homepage loads correctly on mobile/desktop
- [ ] Services page displays all treatments
- [ ] About page shows clinic information
- [ ] Contact form submits successfully
- [ ] Appointment booking works end-to-end

#### Authentication
- [ ] User registration (admin/patient)
- [ ] User login with valid credentials
- [ ] Password reset functionality
- [ ] Protected route access control
- [ ] Session management

#### Admin Dashboard
- [ ] Dashboard statistics display correctly
- [ ] Patient CRUD operations
- [ ] Appointment scheduling and management
- [ ] Inventory management with alerts
- [ ] Transaction recording and reporting
- [ ] Mobile sidebar navigation

#### Patient Dashboard
- [ ] Patient can view their appointments
- [ ] Medical history is accessible
- [ ] Profile updates work correctly

### Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Mobile responsiveness on all devices
- [ ] API response times < 500ms
- [ ] Database query optimization

## 📈 Performance Optimizations

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Vite's built-in optimizations
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Browser caching for static assets
- **Compression**: Gzip compression enabled

### Backend
- **Database Indexing**: Optimized queries with indexes
- **Connection Pooling**: Supabase handles connection management
- **Rate Limiting**: Prevents API abuse
- **Caching**: Redis caching for frequently accessed data
- **Compression**: Response compression middleware

## 🐛 Troubleshooting

### Common Issues

**1. Supabase Connection Issues**
```bash
# Check environment variables
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Verify Supabase project status
```

**2. Authentication Problems**
```bash
# Clear browser storage
localStorage.clear()
sessionStorage.clear()

# Check JWT token expiration
```

**3. Mobile Responsiveness Issues**
```bash
# Test on different viewport sizes
# Check CSS media queries
# Verify touch event handling
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for the component library
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Lucide Icons](https://lucide.dev) for the icon library

## 📞 Support

For support and questions:
- Email: support@dentalcarepro.com
- Documentation: [docs.dentalcarepro.com](https://docs.dentalcarepro.com)
- Issues: [GitHub Issues](https://github.com/your-username/dental-management-system/issues)

---

**Built with ❤️ for dental professionals worldwide**
