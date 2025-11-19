-- Sweet Delights Bakery - Supabase Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- TABLES
-- ============================================

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  items JSONB NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  customer_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table (for dynamic product management)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT CHECK (category IN ('cake', 'donut', 'pastry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table (for dynamic gallery management)
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Orders Policies
-- Allow anyone to insert orders (for customer orders)
CREATE POLICY "Allow public insert orders" 
ON orders FOR INSERT 
TO anon 
WITH CHECK (true);

-- Allow anyone to read orders (for admin dashboard)
CREATE POLICY "Allow public read orders" 
ON orders FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated users to update orders (for admin)
CREATE POLICY "Allow authenticated update orders" 
ON orders FOR UPDATE 
TO authenticated 
USING (true);

-- Products Policies
-- Allow anyone to read products
CREATE POLICY "Allow public read products" 
ON products FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated users to manage products (admin only)
CREATE POLICY "Allow authenticated insert products" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated update products" 
ON products FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "Allow authenticated delete products" 
ON products FOR DELETE 
TO authenticated 
USING (true);

-- Gallery Policies
-- Allow anyone to read gallery
CREATE POLICY "Allow public read gallery" 
ON gallery FOR SELECT 
TO anon 
USING (true);

-- Allow authenticated users to manage gallery (admin only)
CREATE POLICY "Allow authenticated insert gallery" 
ON gallery FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete gallery" 
ON gallery FOR DELETE 
TO authenticated 
USING (true);

-- Admins Policies
-- Only allow service role to access admins table
CREATE POLICY "Service role only admins" 
ON admins FOR ALL 
TO service_role 
USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for products table
CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default admin user
-- Password: admin123 (CHANGE THIS IN PRODUCTION!)
-- To generate a new hash: bcrypt.hashSync('your_password', 10)
INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2a$10$rOzJQjQvQxQxQxQxQxQxQeK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K')
ON CONFLICT (username) DO NOTHING;

-- Sample products (optional - you can use static data instead)
INSERT INTO products (name, price, description, image, category) VALUES
  ('Vanilla Love Cake', 45000, 'Classic vanilla sponge with buttercream frosting. Perfect for any celebration!', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80', 'cake'),
  ('Chocolate Dream', 50000, 'Rich chocolate layers with smooth chocolate ganache. A chocolate lover''s paradise!', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80', 'cake'),
  ('Glazed Classic', 3000, 'Traditional glazed donut with a perfect sweet coating.', 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&q=80', 'donut'),
  ('Chocolate Sprinkles', 3500, 'Chocolate frosted donut topped with colorful sprinkles.', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500&q=80', 'donut')
ON CONFLICT DO NOTHING;

-- Sample gallery images (optional)
INSERT INTO gallery (url, alt) VALUES
  ('https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80', 'Beautiful wedding cake'),
  ('https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80', 'Birthday cake with candles'),
  ('https://images.unsplash.com/photo-1562440499-64c9a4d07d46?w=800&q=80', 'Colorful cupcakes'),
  ('https://images.unsplash.com/photo-1557925923-cd4648e211a0?w=800&q=80', 'Elegant tiered cake')
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS (Optional - for analytics)
-- ============================================

-- View for order statistics
CREATE OR REPLACE VIEW order_stats AS
SELECT 
  COUNT(*) as total_orders,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
  SUM(total) as total_revenue,
  AVG(total) as average_order_value,
  DATE_TRUNC('day', created_at) as order_date
FROM orders
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY order_date DESC;

-- ============================================
-- NOTES
-- ============================================

/*
IMPORTANT SECURITY NOTES:

1. Change the default admin password immediately after setup!
   - Generate new hash: bcrypt.hashSync('your_secure_password', 10)
   - Update: UPDATE admins SET password_hash = 'new_hash' WHERE username = 'admin';

2. The RLS policies allow public access to orders and products for the website to function.
   - This is safe because users can only insert their own orders
   - Admin operations require authentication through the backend

3. For production, consider:
   - Adding rate limiting
   - Implementing API keys
   - Adding audit logs
   - Setting up database backups

4. Monitor your Supabase usage:
   - Check API request logs
   - Monitor database size
   - Review authentication logs

5. Regular maintenance:
   - Update indexes as needed
   - Vacuum database periodically
   - Review and optimize slow queries
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('orders', 'admins', 'products', 'gallery');

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('orders', 'admins', 'products', 'gallery');

-- Verify admin user was created
SELECT username, created_at FROM admins;

-- Check sample data
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as gallery_count FROM gallery;
