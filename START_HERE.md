# 🎂 START HERE - Sweet Delights Bakery

Welcome! Your beautiful bakery website is ready. Follow these simple steps to get started.

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Everything
Open terminal in this folder and run:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### Step 2: Set Up Database

1. Go to **[supabase.com](https://supabase.com)**
2. Click **"New Project"**
3. Fill in:
   - Name: Sweet Delights Bakery
   - Database Password: (create a strong password)
   - Region: (choose closest to Uganda)
4. Click **"Create new project"** and wait 2 minutes

### Step 3: Create Database Tables

1. In Supabase, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. Open the file **`SUPABASE_SCHEMA.sql`** in this folder
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Step 4: Get Your API Keys

1. In Supabase, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (long string starting with eyJ...)
   - **service_role** key (another long string)

### Step 5: Create Environment Files

#### Frontend Environment

Create a file named **`.env`** in the main bakery folder:

```env
VITE_SUPABASE_URL=paste_your_project_url_here
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
VITE_WHATSAPP_NUMBER=256778087986
VITE_API_URL=http://localhost:5000
```

**Replace** the values with your actual Supabase URL and anon key!

#### Backend Environment

Create a file named **`.env`** in the **backend** folder:

```env
SUPABASE_URL=paste_your_project_url_here
SUPABASE_SERVICE_KEY=paste_your_service_role_key_here
PORT=5000
```

**Replace** with your actual Supabase URL and service_role key!

### Step 6: Run the Website

Open **TWO** terminal windows:

#### Terminal 1 - Frontend
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:3000
```

#### Terminal 2 - Backend
```bash
cd backend
npm start
```

You should see:
```
Server running on port 5000
```

### Step 7: Open the Website

Open your browser and go to:
- **Main Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin.html

**Admin Login:**
- Username: `admin`
- Password: `admin123`

## 🎉 You're Done!

Your website is now running! Try:
- ✅ Browse products
- ✅ Add items to cart
- ✅ Click checkout (opens WhatsApp)
- ✅ Login to admin dashboard
- ✅ View orders

## 🎨 Customize Your Website

### Change Products

Edit **`src/data/products.ts`**:
- Update product names, prices, descriptions
- Change product images (use your own URLs)
- Add or remove products

### Change Colors

Edit **`src/styles/App.css`** (lines 1-8):
```css
:root {
  --primary-pink: #ff9ec1;     /* Change this */
  --secondary-pink: #ffb3d9;   /* And this */
  --light-pink: #ffe6f0;       /* And this */
  /* ... */
}
```

### Change Contact Info

Edit **`src/components/Footer.tsx`**:
- Update phone number
- Update location
- Update developer name

### Change WhatsApp Number

Edit **`.env`** file:
```env
VITE_WHATSAPP_NUMBER=your_number_here
```

## 🚀 Deploy to Internet

When ready to go live, follow **`DEPLOYMENT.md`** for:
- Deploying frontend to Vercel (free)
- Deploying backend to Render (free)
- Setting up custom domain

## ❓ Troubleshooting

### "Cannot find module" errors
```bash
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
- Double-check your .env files
- Make sure you copied the FULL keys (they're very long!)
- Verify your Supabase project is active

### WhatsApp not opening
- Check VITE_WHATSAPP_NUMBER in .env
- Make sure format is: 256778087986 (country code + number, no spaces)

## 📚 Documentation

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **DEPLOYMENT.md** - How to deploy online
- **PROJECT_SUMMARY.md** - Project overview
- **SUPABASE_SCHEMA.sql** - Database setup

## 🆘 Need Help?

1. Check the documentation files above
2. Review error messages in terminal
3. Contact: Ntale Stephen - 0778087986

## ✅ Checklist

Before going live, make sure to:

- [ ] Install all dependencies
- [ ] Set up Supabase database
- [ ] Create .env files with correct keys
- [ ] Test website locally
- [ ] Change admin password
- [ ] Replace sample product images with real photos
- [ ] Update contact information
- [ ] Test WhatsApp integration
- [ ] Test admin dashboard
- [ ] Deploy to production
- [ ] Set up custom domain (optional)

## 🎯 What You Have

✅ Beautiful, modern website  
✅ Mobile-responsive design  
✅ Shopping cart system  
✅ WhatsApp ordering  
✅ Admin dashboard  
✅ Product management  
✅ Order tracking  
✅ Secure authentication  
✅ Production-ready code  
✅ Complete documentation  

## 🌟 Features

- **Hero Section** - Eye-catching landing page
- **Products** - Cakes, donuts, pastries with filtering
- **Gallery** - Showcase your beautiful creations
- **Cart** - Easy shopping experience
- **WhatsApp** - Direct customer communication
- **Admin** - Manage orders efficiently
- **Responsive** - Works on all devices
- **Animations** - Smooth, professional effects

---

**Ready to start selling delicious cakes! 🎂**

For detailed instructions, see **SETUP.md** or **README.md**

**Developer:** Ntale Stephen | **Contact:** 0778087986
