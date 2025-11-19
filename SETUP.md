# Quick Setup Guide

Follow these steps to get your bakery website running locally.

## Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

## Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to Project Settings → API
4. Copy your project URL and anon key

## Step 3: Create Database Tables

1. In Supabase, go to SQL Editor
2. Copy the contents of `SUPABASE_SCHEMA.sql`
3. Paste and run it in the SQL Editor

## Step 4: Configure Environment Variables

### Frontend Environment (.env in root)

Create `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=256778087986
VITE_API_URL=http://localhost:5000
```

### Backend Environment (backend/.env)

Create `.env` file in the `backend` directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
```

**Note:** Get the service role key from Supabase → Project Settings → API → service_role key

## Step 5: Run the Application

Open two terminal windows:

### Terminal 1 - Frontend
```bash
npm run dev
```

The frontend will run on http://localhost:3000

### Terminal 2 - Backend
```bash
cd backend
npm start
```

The backend will run on http://localhost:5000

## Step 6: Access the Website

- **Main Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin.html

**Default Admin Login:**
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT:** Change the admin password after first login!

## Troubleshooting

### "Cannot find module" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

cd backend
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Supabase connection errors
- Verify your environment variables are correct
- Check if your Supabase project is active
- Ensure you copied the correct keys

## Next Steps

1. ✅ Test all features:
   - Browse products
   - Add items to cart
   - Test WhatsApp checkout
   - Login to admin dashboard
   - View orders

2. ✅ Customize:
   - Update products in `src/data/products.ts`
   - Change colors in `src/styles/App.css`
   - Update contact info in Footer component

3. ✅ Deploy:
   - Follow `DEPLOYMENT.md` for production deployment
   - Set up custom domain
   - Configure production environment variables

## Need Help?

- Check `README.md` for detailed documentation
- Review `DEPLOYMENT.md` for deployment instructions
- Contact: Ntale Stephen - 0778087986

## Quick Commands Reference

```bash
# Start development
npm run dev                    # Frontend
cd backend && npm start        # Backend

# Build for production
npm run build                  # Frontend

# Preview production build
npm run preview                # Frontend

# Install new package
npm install package-name       # Frontend
cd backend && npm install package-name  # Backend
```

Enjoy your beautiful bakery website! 🎂
