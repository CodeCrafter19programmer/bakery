# Sweet Delights Bakery Website

A beautiful, modern bakery website built with React, TypeScript, Node.js, and Supabase. Features a responsive design with pink and pastel colors, WhatsApp ordering integration, and an admin dashboard.

## Features

- 🎂 **Beautiful Product Showcase** - Cakes, donuts, and pastries with images and descriptions
- 🛒 **Shopping Cart** - Add items with custom text for cakes
- 📱 **WhatsApp Integration** - Direct checkout via WhatsApp with formatted order details
- 🎨 **Modern UI** - Pink and pastel color scheme with smooth animations
- 📊 **Admin Dashboard** - Manage orders, products, and gallery images
- 📱 **Fully Responsive** - Mobile-first design for all screen sizes
- ⚡ **Fast Performance** - Optimized images and lightweight animations

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Bootstrap 5** for responsive layout
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Supabase Client** for database integration

### Backend
- **Node.js** with Express
- **Supabase** for database and authentication
- **CORS** enabled for cross-origin requests

## Project Structure

```
bakery/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Products.tsx
│   │   ├── ProductCard.tsx
│   │   ├── Gallery.tsx
│   │   ├── Location.tsx
│   │   ├── Social.tsx
│   │   ├── Footer.tsx
│   │   └── CartSidebar.tsx
│   ├── styles/              # CSS files
│   │   ├── App.css
│   │   └── Admin.css
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── whatsapp.ts
│   ├── lib/                 # Libraries
│   │   └── supabase.ts
│   ├── data/                # Static data
│   │   └── products.ts
│   ├── App.tsx              # Main app component
│   ├── admin.tsx            # Admin dashboard
│   └── main.tsx             # Entry point
├── backend/
│   ├── server.js            # Express server
│   └── package.json         # Backend dependencies
├── index.html               # Main HTML file
├── admin.html               # Admin HTML file
├── package.json             # Frontend dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md                # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Git

### 1. Clone and Install

```bash
cd bakery
npm install
cd backend
npm install
cd ..
```

### 2. Supabase Setup

Create a new Supabase project at [supabase.com](https://supabase.com)

#### Create Tables

Run these SQL commands in Supabase SQL Editor:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  customer_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins table
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (optional - for dynamic products)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT CHECK (category IN ('cake', 'donut', 'pastry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery table (optional - for dynamic gallery)
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public insert for orders, admin access for others)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow public read orders" ON orders FOR SELECT TO anon USING (true);
```

#### Create Admin User

```sql
-- Insert admin user (password: admin123 - CHANGE THIS!)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$rOzJQjQvQxQxQxQxQxQxQeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K');
```

To generate a new password hash, use bcrypt:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

### 3. Environment Variables

Create `.env` in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=256778087986
```

Create `.env` in the `backend` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
```

### 4. Run Development Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:3000`

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```
Backend runs on `http://localhost:5000`

### 5. Access the Application

- **Main Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin.html

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123` (change this in production!)

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
5. Deploy!

### Backend (Render)

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Set:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
5. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `PORT`
6. Deploy!

### Update Frontend API URL

After deploying backend, update the frontend `.env`:
```env
VITE_API_URL=your_render_backend_url
```

## Features Breakdown

### WhatsApp Integration
When users checkout, they're redirected to WhatsApp with a pre-formatted message containing:
- Product names and quantities
- Custom text for cakes
- Individual and total prices
- Professional greeting

### Admin Dashboard
- View all orders in real-time
- Update order status (pending/completed)
- Manage products (coming soon)
- Upload gallery images (coming soon)

### Responsive Design
- Mobile-first approach
- Smooth animations with Framer Motion
- Touch-friendly interface
- Optimized for all screen sizes

## Customization

### Colors
Edit `src/styles/App.css` to change the color scheme:
```css
:root {
  --primary-pink: #ff9ec1;
  --secondary-pink: #ffb3d9;
  --light-pink: #ffe6f0;
  /* ... more colors */
}
```

### Products
Edit `src/data/products.ts` to add/modify products and gallery images.

### Contact Information
Update phone number in:
- `.env` file (`VITE_WHATSAPP_NUMBER`)
- `src/components/Footer.tsx`

## Support

For issues or questions, contact:
- **Developer:** Ntale Stephen
- **Phone:** 0778087986

## License

© 2024 Sweet Delights Bakery. All rights reserved.
