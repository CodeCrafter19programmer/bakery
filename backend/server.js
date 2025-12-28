import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
const JWT_EXPIRES_IN = '24h';

// CORS configuration - restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : ['http://localhost:3000', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in dev only
    if (!origin && process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    const normalizedOrigin = typeof origin === 'string' ? origin.replace(/\/$/, '') : origin;
    const normalizedAllowedOrigins = allowedOrigins.map((o) => o.replace(/\/$/, ''));
    if (normalizedAllowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { error: 'Too many requests. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Auth middleware - verifies JWT token
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Routes

// Get all orders (admin only)
app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status (admin only)
app.patch('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Admin login - returns JWT token (rate limited)
app.post('/api/admin/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, data.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: data.id, username: data.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ 
      success: true, 
      token,
      admin: { id: data.id, username: data.username } 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Token verification endpoint
app.get('/api/admin/verify', requireAdmin, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});

// Upload product (admin only)
app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const { name, price, description, image, category } = req.body;

    // Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }

    const validCategories = ['cake', 'donut', 'pastry'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const product = { name, price: Number(price), description, image, category };

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Delete product (admin only)
app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Upload gallery image (admin only)
app.post('/api/gallery', requireAdmin, async (req, res) => {
  try {
    const { url, alt } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const image = { url, alt: alt || '' };

    const { data, error } = await supabase
      .from('gallery')
      .insert([image])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Delete gallery image (admin only)
app.delete('/api/gallery/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// Create order (public endpoint - replaces direct Supabase insert)
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total, customer_message } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    if (typeof total !== 'number' || total <= 0) {
      return res.status(400).json({ error: 'Valid total is required' });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.name || !item.price || !item.quantity) {
        return res.status(400).json({ error: 'Each item must have name, price, and quantity' });
      }
    }

    const orderData = {
      items,
      total,
      status: 'pending',
      customer_message: customer_message || '',
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
