# Dental Management System - Backend API

A comprehensive backend API for the Dental Management System built with Node.js, Express, TypeScript, and Supabase.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Multi-tenant Architecture**: Clinic-based data separation
- **Comprehensive APIs**: Full CRUD operations for all entities
- **Security**: Input validation, sanitization, rate limiting, and security headers
- **Error Handling**: Centralized error handling with detailed logging
- **Email Notifications**: Automated appointment confirmations and reminders
- **Payment Methods**: Support for multiple payment methods including Pakistani mobile wallets
- **Real-time Updates**: Integration with Supabase real-time features
- **API Documentation**: Comprehensive endpoint documentation

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Joi
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Custom logger utility

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── supabase.ts  # Supabase client setup
│   ├── controllers/     # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── appointment.controller.ts
│   │   ├── treatment.controller.ts
│   │   ├── inventory.controller.ts
│   │   └── transaction.controller.ts
│   ├── middleware/      # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── patient.routes.ts
│   │   ├── appointment.routes.ts
│   │   ├── treatment.routes.ts
│   │   ├── inventory.routes.ts
│   │   └── transaction.routes.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts
│   │   └── email.ts
│   └── server.ts        # Main server file
├── package.json
├── tsconfig.json
└── .env.example
```

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   
   # Supabase Configuration
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # JWT Configuration
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   
   # CORS
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update user profile (authenticated)
- `POST /api/auth/refresh-token` - Refresh JWT token

### Patients (Admin only)
- `POST /api/patients` - Create patient
- `GET /api/patients` - Get all patients (paginated)
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/:id/appointments` - Get patient appointments
- `GET /api/patients/:id/transactions` - Get patient transactions

### Appointments
- `POST /api/appointments` - Create appointment (Admin)
- `GET /api/appointments` - Get all appointments (Admin)
- `GET /api/appointments/:id` - Get appointment by ID
- `PUT /api/appointments/:id` - Update appointment (Admin)
- `DELETE /api/appointments/:id` - Delete appointment (Admin)
- `PATCH /api/appointments/:id/status` - Update appointment status (Admin)
- `GET /api/appointments/patient/my-appointments` - Get user's appointments (Patient)
- `POST /api/appointments/book` - Public appointment booking

### Treatments (Admin only)
- `POST /api/treatments` - Create treatment
- `GET /api/treatments` - Get all treatments (paginated)
- `GET /api/treatments/:id` - Get treatment by ID
- `PUT /api/treatments/:id` - Update treatment
- `DELETE /api/treatments/:id` - Delete treatment

### Inventory (Admin only)
- `POST /api/inventory` - Create inventory item
- `GET /api/inventory` - Get all inventory items (paginated)
- `GET /api/inventory/:id` - Get inventory item by ID
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item
- `PATCH /api/inventory/:id/stock` - Update stock levels
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/expiring` - Get expiring items
- `GET /api/inventory/categories` - Get all categories

### Transactions (Admin only)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (paginated)
- `GET /api/transactions/:id` - Get transaction by ID
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/summary` - Get transaction summary
- `GET /api/transactions/reports/daily` - Get daily report
- `GET /api/transactions/reports/monthly` - Get monthly report

## 🔐 Authentication & Authorization

The API uses JWT tokens for authentication with role-based access control:

- **Admin Role**: Full access to all endpoints
- **Patient Role**: Limited access to own data only
- **Public**: Access to appointment booking and basic endpoints

### Headers
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Parameterized queries via Supabase
- **XSS Protection**: Input sanitization
- **JWT Security**: Secure token handling

## 💳 Payment Methods Supported

- Cash
- Bank Transfer
- Credit Card
- EasyPaisa (Pakistani mobile wallet)
- JazzCash (Pakistani mobile wallet)
- Insurance

## 📧 Email Notifications

Automated email notifications for:
- Appointment confirmations
- Appointment reminders
- Password reset requests
- Account verification

## 🔍 Error Handling

Standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "errors": [] // Validation errors array
}
```

## 📄 Response Format

Standardized success responses:
```json
{
  "success": true,
  "message": "Success message",
  "data": {} // Response data
}
```

Paginated responses:
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🧪 Testing

```bash
npm test
```

## 📝 Logging

The API includes comprehensive logging:
- Request/Response logging
- Error logging
- Debug logging (development only)
- Email notification logging

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the production server**
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.
