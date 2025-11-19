# Deployment Guide

Complete guide for deploying the Sweet Delights Bakery website to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Supabase project (already set up)

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd bakery
git init
git add .
git commit -m "Initial commit: Sweet Delights Bakery"
```

### 1.2 Create GitHub Repository

1. Go to GitHub and create a new repository
2. Push your code:

```bash
git remote add origin https://github.com/yourusername/bakery.git
git branch -M main
git push -u origin main
```

### 1.3 Create .gitignore

Create `.gitignore` file:
```
node_modules/
.env
.env.local
dist/
backend/node_modules/
backend/.env
.DS_Store
```

## Step 2: Deploy Backend to Render

### 2.1 Create Web Service

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** `bakery-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** Leave empty
   - **Runtime:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`

### 2.2 Add Environment Variables

In Render dashboard, add these environment variables:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
PORT=5000
```

### 2.3 Deploy

Click "Create Web Service" and wait for deployment to complete.

**Note your backend URL:** `https://bakery-backend-xxxx.onrender.com`

## Step 3: Deploy Frontend to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository

### 3.2 Configure Build Settings

Vercel should auto-detect Vite. Verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 3.3 Add Environment Variables

Add these environment variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=256778087986
VITE_API_URL=https://bakery-backend-xxxx.onrender.com
```

**Important:** Replace `https://bakery-backend-xxxx.onrender.com` with your actual Render backend URL from Step 2.3.

### 3.4 Deploy

Click "Deploy" and wait for deployment to complete.

Your site will be live at: `https://your-project-name.vercel.app`

## Step 4: Configure Custom Domain (Optional)

### 4.1 Vercel Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 4.2 Update Environment Variables

If using custom domain, update:
- WhatsApp messages (if needed)
- Any hardcoded URLs

## Step 5: Verify Deployment

### 5.1 Test Main Website

1. Visit your Vercel URL
2. Test all sections:
   - Hero section loads
   - Products display correctly
   - Gallery images load
   - Cart functionality works
   - WhatsApp redirect works

### 5.2 Test Admin Dashboard

1. Visit `https://your-vercel-url/admin.html`
2. Login with admin credentials
3. Verify orders display
4. Test order status updates

### 5.3 Test Backend API

Test endpoints:
```bash
# Get orders
curl https://your-render-url/api/orders

# Get products
curl https://your-render-url/api/products
```

## Step 6: Post-Deployment Configuration

### 6.1 Update Supabase CORS

In Supabase dashboard:
1. Go to Settings → API
2. Add your Vercel domain to allowed origins

### 6.2 Enable HTTPS

Both Vercel and Render provide automatic HTTPS. Verify:
- Frontend uses `https://`
- Backend uses `https://`
- All API calls use HTTPS

### 6.3 Update Admin Password

**IMPORTANT:** Change the default admin password!

1. Generate new password hash:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_new_secure_password', 10);
console.log(hash);
```

2. Update in Supabase:
```sql
UPDATE admins 
SET password_hash = 'your_new_hash'
WHERE username = 'admin';
```

## Step 7: Monitoring and Maintenance

### 7.1 Set Up Monitoring

**Vercel:**
- Enable Analytics in project settings
- Monitor build logs for errors

**Render:**
- Check service logs regularly
- Set up health checks

**Supabase:**
- Monitor database usage
- Check API request logs

### 7.2 Regular Updates

```bash
# Update dependencies
npm update
cd backend && npm update

# Test locally
npm run dev

# Commit and push
git add .
git commit -m "Update dependencies"
git push
```

Vercel and Render will auto-deploy on push.

## Troubleshooting

### Frontend Issues

**Problem:** White screen / blank page
- Check browser console for errors
- Verify environment variables are set
- Check build logs in Vercel

**Problem:** API calls failing
- Verify `VITE_API_URL` is correct
- Check CORS settings
- Verify backend is running

### Backend Issues

**Problem:** 500 errors
- Check Render logs
- Verify Supabase credentials
- Check database connection

**Problem:** Orders not saving
- Verify Supabase policies
- Check table permissions
- Review backend logs

### Database Issues

**Problem:** Connection errors
- Verify Supabase URL and keys
- Check if service is paused (free tier)
- Review connection limits

## Performance Optimization

### 1. Image Optimization

Replace Unsplash URLs with optimized images:
- Use WebP format
- Compress images
- Use CDN (Cloudinary, ImageKit)

### 2. Caching

Enable caching in Vercel:
```json
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. Database Optimization

- Add indexes on frequently queried columns
- Enable connection pooling
- Use Supabase Edge Functions for complex queries

## Security Checklist

- ✅ Change default admin password
- ✅ Use environment variables for secrets
- ✅ Enable HTTPS everywhere
- ✅ Set up Supabase Row Level Security
- ✅ Limit API rate limiting (if needed)
- ✅ Regular dependency updates
- ✅ Monitor error logs

## Backup Strategy

### Database Backups

Supabase provides automatic backups. To manually backup:

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### Code Backups

- GitHub repository (primary)
- Local copies
- Regular commits

## Support

For deployment issues:
- **Developer:** Ntale Stephen
- **Phone:** 0778087986

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
