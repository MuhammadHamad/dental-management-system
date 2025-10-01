# 🚀 DentalCare Pro - Production Deployment Guide

Complete guide for deploying the Dental Management System to production environments.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Code reviewed and tested
- [ ] Git repository clean (no uncommitted changes)
- [ ] Version tagged in Git

### Environment Setup
- [ ] Production Supabase project created
- [ ] Database schema deployed
- [ ] Row Level Security (RLS) policies enabled
- [ ] Environment variables configured
- [ ] SSL certificates obtained

### Performance
- [ ] Bundle size optimized
- [ ] Images compressed
- [ ] Lazy loading implemented
- [ ] Caching strategies configured

## 🏗️ Infrastructure Setup

### 1. Supabase Production Setup

#### Create Production Project
```bash
# 1. Go to https://supabase.com/dashboard
# 2. Create new project
# 3. Choose region closest to your users
# 4. Note down project URL and keys
```

#### Database Migration
```sql
-- Run these SQL commands in Supabase SQL Editor

-- 1. Create tables (copy from your development schema)
-- 2. Enable RLS on all tables
-- 3. Create policies for multi-tenant access
-- 4. Insert demo data if needed

-- Example RLS policy for patients table
CREATE POLICY "Users can only see their clinic's patients" ON patients
  FOR ALL USING (clinic_id = auth.jwt() ->> 'clinic_id');
```

#### Environment Variables
```env
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Frontend Deployment (Vercel)

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### Option B: GitHub Integration
```bash
# 1. Push code to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Connect repository to Vercel
# 3. Configure environment variables in Vercel dashboard
# 4. Deploy automatically on push
```

#### Vercel Configuration (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "env": {
    "VITE_SUPABASE_URL": "@vite_supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@vite_supabase_anon_key"
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
```

### 3. Backend Deployment (Railway)

#### Railway Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

#### Railway Configuration
```bash
# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set SUPABASE_URL=your-supabase-url
railway variables set SUPABASE_SERVICE_ROLE_KEY=your-service-key
railway variables set JWT_SECRET=your-strong-secret
railway variables set CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### Alternative: Heroku Deployment
```bash
# Install Heroku CLI
# Create Heroku app
heroku create dentalcare-pro-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SUPABASE_URL=your-supabase-url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your-service-key
heroku config:set JWT_SECRET=your-strong-secret

# Deploy
git push heroku main
```

## 🔧 Configuration Files

### Frontend Build Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
```

### Backend Production Configuration
```typescript
// src/config/production.ts
export const productionConfig = {
  port: process.env.PORT || 3001,
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [],
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  },
  security: {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }
  }
}
```

## 🌐 Domain Configuration

### Custom Domain Setup
```bash
# Vercel custom domain
vercel domains add yourdomain.com
vercel domains add www.yourdomain.com

# Configure DNS records
# A record: @ -> 76.76.19.61
# CNAME record: www -> cname.vercel-dns.com
```

### SSL Certificate
```bash
# Vercel automatically provides SSL certificates
# For custom domains, certificates are auto-generated
# Ensure HTTPS redirect is enabled
```

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing

# Configure in main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

### Analytics (Google Analytics)
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Performance Monitoring
```bash
# Lighthouse CI for continuous monitoring
npm install -g @lhci/cli

# Configure lighthouse CI
# .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['https://yourdomain.com'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}]
      }
    }
  }
}
```

## 🔒 Security Configuration

### Environment Variables
```env
# Production Frontend (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-api-domain.railway.app

# Production Backend (.env)
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-very-strong-secret-key-here
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Security Headers
```typescript
// Add to backend middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://your-project.supabase.co"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## 🚀 Deployment Scripts

### Frontend Deployment Script
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && vercel --prod",
    "deploy:staging": "npm run build && vercel"
  }
}
```

### Backend Deployment Script
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "deploy": "npm run build && railway up",
    "logs": "railway logs"
  }
}
```

## 📈 Performance Optimization

### Frontend Optimizations
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const Patients = lazy(() => import('./pages/admin/Patients'));

// Code splitting
const AdminRoutes = lazy(() => import('./routes/AdminRoutes'));
const PublicRoutes = lazy(() => import('./routes/PublicRoutes'));

// Image optimization
const optimizedImages = {
  hero: '/images/hero-optimized.webp',
  fallback: '/images/hero.jpg'
};
```

### Backend Optimizations
```typescript
// Database connection pooling
const supabase = createClient(url, key, {
  db: {
    schema: 'public',
  },
  auth: {
    autoRefreshToken: true,
    persistSession: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Response compression
app.use(compression({
  level: 6,
  threshold: 1024,
}));
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm run build
      - uses: railway-app/railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
```

## 🧪 Production Testing

### Smoke Tests
```bash
# Test critical paths after deployment
curl -f https://yourdomain.com/health
curl -f https://your-api.railway.app/health

# Test authentication
curl -X POST https://your-api.railway.app/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
# artillery.yml
config:
  target: 'https://yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Homepage load test"
    requests:
      - get:
          url: "/"

# Run load test
artillery run artillery.yml
```

## 📋 Post-Deployment Checklist

### Immediate Checks
- [ ] Frontend loads without errors
- [ ] Backend API responds correctly
- [ ] Database connections work
- [ ] Authentication functions
- [ ] All routes accessible
- [ ] SSL certificate active
- [ ] Custom domain resolves

### Performance Checks
- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Mobile performance acceptable

### Security Checks
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] Rate limiting active
- [ ] CORS configured correctly

### Monitoring Setup
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring enabled
- [ ] Log aggregation working
- [ ] Backup systems verified

## 🆘 Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

**Environment Variable Issues**
```bash
# Verify variables are set
vercel env ls
railway variables

# Test locally with production env
cp .env.production .env.local
npm run dev
```

**Database Connection Issues**
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/

# Check RLS policies
# Verify in Supabase dashboard
```

### Rollback Procedure
```bash
# Vercel rollback
vercel rollback [deployment-url]

# Railway rollback
railway rollback [deployment-id]

# Database rollback (if needed)
# Restore from backup in Supabase dashboard
```

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/help
- **Supabase Support**: https://supabase.com/support

---

**Deployment completed by**: ________________  
**Date**: ________________  
**Version**: ________________  
**Production URL**: ________________
