# System Architecture

## Overview

Sweet Delights Bakery is a full-stack web application with a React frontend, Node.js backend, and Supabase database.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USERS                                │
│  (Customers browsing website & Admin managing orders)       │
└────────────────┬────────────────────────────┬────────────────┘
                 │                            │
                 │                            │
        ┌────────▼─────────┐        ┌────────▼─────────┐
        │   FRONTEND       │        │   ADMIN          │
        │   (React/Vite)   │        │   DASHBOARD      │
        │   Port 3000      │        │   /admin.html    │
        └────────┬─────────┘        └────────┬─────────┘
                 │                            │
                 │    HTTP Requests           │
                 │    (REST API)              │
                 │                            │
        ┌────────▼────────────────────────────▼─────────┐
        │         BACKEND (Node.js/Express)             │
        │              Port 5000                        │
        │  ┌──────────────────────────────────────┐    │
        │  │  API Endpoints:                      │    │
        │  │  - GET  /api/orders                  │    │
        │  │  - PATCH /api/orders/:id             │    │
        │  │  - POST /api/admin/login             │    │
        │  │  - GET  /api/products                │    │
        │  │  - POST /api/products                │    │
        │  │  - GET  /api/gallery                 │    │
        │  │  - POST /api/gallery                 │    │
        │  └──────────────────────────────────────┘    │
        └────────┬──────────────────────────────────────┘
                 │
                 │    Supabase Client
                 │    (Database Queries)
                 │
        ┌────────▼──────────────────────────────────────┐
        │         SUPABASE (PostgreSQL)                 │
        │  ┌──────────────────────────────────────┐    │
        │  │  Tables:                             │    │
        │  │  - orders (customer orders)          │    │
        │  │  - admins (admin credentials)        │    │
        │  │  - products (product catalog)        │    │
        │  │  - gallery (gallery images)          │    │
        │  └──────────────────────────────────────┘    │
        └───────────────────────────────────────────────┘
                 │
                 │    WhatsApp API
                 │    (Order Notifications)
                 │
        ┌────────▼──────────────────────────────────────┐
        │              WHATSAPP                          │
        │  Pre-formatted order messages sent to:        │
        │  +256 778 087 986                             │
        └───────────────────────────────────────────────┘
```

## Data Flow

### Customer Order Flow

```
1. Customer browses products
   └─> Frontend displays products from src/data/products.ts

2. Customer adds items to cart
   └─> Cart state managed in React (useState)

3. Customer clicks checkout
   ├─> Order saved to Supabase (orders table)
   └─> WhatsApp opened with pre-formatted message

4. Admin receives WhatsApp notification
   └─> Admin logs into dashboard

5. Admin views order in dashboard
   └─> Backend fetches from Supabase

6. Admin updates order status
   └─> Backend updates Supabase
```

### Admin Authentication Flow

```
1. Admin visits /admin.html
   └─> Admin login form displayed

2. Admin enters credentials
   └─> POST /api/admin/login

3. Backend validates credentials
   ├─> Query admins table in Supabase
   ├─> Compare password hash with bcrypt
   └─> Return success/failure

4. If successful
   └─> Admin dashboard displayed
```

## Component Structure

### Frontend Components

```
App.tsx (Main Container)
├── Navbar
│   └── Cart Icon (with badge)
├── Hero
│   ├── Title & Subtitle
│   └── CTA Buttons
├── Products
│   ├── Category Tabs
│   └── ProductCard (multiple)
│       ├── Image
│       ├── Name & Price
│       ├── Description
│       ├── Custom Text Input (cakes only)
│       ├── Quantity Selector
│       └── Add to Cart Button
├── Gallery
│   └── Gallery Items (grid)
├── Location
│   └── Location Card
├── Social
│   └── Social Icons
├── Footer
│   └── Contact Info & Developer Credit
└── CartSidebar
    ├── Cart Header
    ├── Cart Items (list)
    └── Checkout Button
```

### Admin Dashboard Structure

```
AdminDashboard
├── Login Form (if not logged in)
│   ├── Username Input
│   ├── Password Input
│   └── Login Button
└── Dashboard (if logged in)
    ├── Admin Navbar
    ├── Sidebar
    │   ├── Orders Tab
    │   ├── Products Tab
    │   └── Gallery Tab
    └── Content Area
        └── Orders Table
            ├── Order ID
            ├── Items
            ├── Total
            ├── Date
            ├── Status Badge
            └── Action Button
```

## Technology Stack

### Frontend
```
React 18.2.0
├── TypeScript 5.3.3
├── Vite 5.0.8 (Build Tool)
├── Bootstrap 5.3.2 (Layout)
├── Framer Motion 10.16.16 (Animations)
├── Lucide React 0.294.0 (Icons)
└── Supabase Client 2.39.0 (Database)
```

### Backend
```
Node.js (ES Modules)
├── Express 4.18.2 (Web Framework)
├── Supabase Client 2.39.0 (Database)
├── bcryptjs 2.4.3 (Password Hashing)
├── CORS 2.8.5 (Cross-Origin)
└── dotenv 16.3.1 (Environment Variables)
```

### Database
```
Supabase (PostgreSQL)
├── Row Level Security (RLS)
├── Real-time subscriptions
├── RESTful API
└── Authentication
```

## File Structure

```
bakery/
├── Frontend Source
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS files
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Utility functions
│   │   ├── lib/             # Libraries (Supabase)
│   │   ├── data/            # Static data
│   │   ├── App.tsx          # Main app
│   │   ├── admin.tsx        # Admin dashboard
│   │   └── main.tsx         # Entry point
│   ├── index.html           # Main HTML
│   └── admin.html           # Admin HTML
│
├── Backend
│   └── backend/
│       ├── server.js        # Express server
│       └── package.json     # Dependencies
│
├── Configuration
│   ├── package.json         # Frontend deps
│   ├── tsconfig.json        # TypeScript config
│   ├── vite.config.ts       # Vite config
│   ├── vercel.json          # Vercel config
│   └── .gitignore           # Git ignore
│
└── Documentation
    ├── README.md            # Main docs
    ├── START_HERE.md        # Quick start
    ├── SETUP.md             # Setup guide
    ├── DEPLOYMENT.md        # Deploy guide
    ├── ARCHITECTURE.md      # This file
    ├── PROJECT_SUMMARY.md   # Overview
    └── SUPABASE_SCHEMA.sql  # DB schema
```

## Security Architecture

### Frontend Security
- Environment variables for API keys
- No sensitive data in client code
- HTTPS in production
- Input validation

### Backend Security
- CORS enabled for specific origins
- Password hashing with bcrypt
- Environment variables for secrets
- Service role key for admin operations

### Database Security
- Row Level Security (RLS) enabled
- Public can only insert orders
- Admin operations require authentication
- Service role for admin table access

## Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────────────┐
│              VERCEL (Frontend)                   │
│  - Automatic HTTPS                              │
│  - CDN distribution                             │
│  - Environment variables                        │
│  - Custom domain support                        │
└────────────┬────────────────────────────────────┘
             │
             │ API Calls
             │
┌────────────▼────────────────────────────────────┐
│              RENDER (Backend)                    │
│  - Node.js runtime                              │
│  - Automatic HTTPS                              │
│  - Environment variables                        │
│  - Health checks                                │
└────────────┬────────────────────────────────────┘
             │
             │ Database Queries
             │
┌────────────▼────────────────────────────────────┐
│            SUPABASE (Database)                   │
│  - Managed PostgreSQL                           │
│  - Automatic backups                            │
│  - Real-time capabilities                       │
│  - Built-in authentication                      │
└─────────────────────────────────────────────────┘
```

## API Endpoints

### Public Endpoints
```
GET  /api/orders          # Get all orders
GET  /api/products        # Get all products
GET  /api/gallery         # Get gallery images
```

### Protected Endpoints
```
POST  /api/admin/login    # Admin login
PATCH /api/orders/:id     # Update order status
POST  /api/products       # Create product
POST  /api/gallery        # Upload gallery image
```

## State Management

### Frontend State
- **Cart:** React useState (local state)
- **Products:** Static data (src/data/products.ts)
- **Orders:** Fetched from Supabase
- **Admin Auth:** React useState (session)

### Backend State
- Stateless REST API
- No session storage
- Database as source of truth

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Lazy loading images
- Framer Motion animations (GPU accelerated)
- Bootstrap for optimized CSS
- Minimal bundle size

### Backend
- Connection pooling (Supabase)
- Efficient database queries
- CORS for specific origins
- Lightweight Express server

### Database
- Indexed columns
- Row Level Security
- Efficient queries
- Connection pooling

## Scalability Considerations

### Current Capacity
- Supabase free tier: 500MB database, 2GB bandwidth
- Vercel free tier: Unlimited bandwidth
- Render free tier: 750 hours/month

### Scaling Options
1. **Upgrade Supabase** - More storage and bandwidth
2. **Add Caching** - Redis for frequent queries
3. **CDN for Images** - Cloudinary or ImageKit
4. **Load Balancing** - Multiple backend instances
5. **Database Optimization** - Indexes and views

## Monitoring & Logging

### Frontend Monitoring
- Vercel Analytics
- Browser console errors
- Build logs

### Backend Monitoring
- Render logs
- Express error handling
- API response times

### Database Monitoring
- Supabase dashboard
- Query performance
- Connection stats

---

**This architecture provides a solid foundation for a production bakery website with room to grow!**
