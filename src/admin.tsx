import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import './styles/Admin.css';
import { LogOut, Package, Image as ImageIcon, ShoppingBag, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed';
  created_at: string;
  customer_message: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'cake' | 'donut' | 'pastry';
}

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'gallery'>('orders');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: 'cake' as 'cake' | 'donut' | 'pastry',
  });

  const [newImage, setNewImage] = useState({
    url: '',
    alt: '',
  });

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      fetchProducts();
      fetchGallery();
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`);
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed') => {
    try {
      await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Genesis Cakes</p>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="container-fluid">
          <h1 className="admin-brand">Genesis Cakes Admin</h1>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            <LogOut size={20} className="me-2" />
            Logout
          </button>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-md-3">
            <div className="admin-sidebar">
              <button
                className={`sidebar-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={20} />
                Orders
              </button>
              <button
                className={`sidebar-btn ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <Package size={20} />
                Products
              </button>
              <button
                className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                onClick={() => setActiveTab('gallery')}
              >
                <ImageIcon size={20} />
                Gallery
              </button>
            </div>
          </div>

          <div className="col-md-9">
            {activeTab === 'orders' && (
              <div className="admin-content">
                <h2 className="mb-4">Orders Management</h2>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id.slice(0, 8)}</td>
                          <td>{order.customer_message}</td>
                          <td>{order.total.toLocaleString()} UGX</td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {order.status === 'pending' && (
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                              >
                                Mark Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="admin-content">
                <h2 className="mb-4">Products Management</h2>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5>Add New Product</h5>
                    <form onSubmit={handleCreateProduct}>
                      <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Vanilla Love Cake"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price (UGX)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="45000"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Classic vanilla sponge with buttercream frosting. Perfect for any celebration!"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={newProduct.image}
                          onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-select"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as 'cake' | 'donut' | 'pastry' })}
                        >
                          <option value="cake">Cake</option>
                          <option value="donut">Donut</option>
                          <option value="pastry">Pastry</option>
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">Save Product</button>
                    </form>
                  </div>

                  <div className="col-md-6">
                    <h5>Existing Products</h5>
                    {products.length === 0 ? (
                      <p className="text-muted">No products found.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product) => (
                              <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.price.toLocaleString()} UGX</td>
                                <td>{product.category}</td>
                                <td>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="admin-content">
                <h2 className="mb-4">Gallery Management</h2>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <h5>Add Gallery Image</h5>
                    <form onSubmit={handleCreateImage}>
                      <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                          type="url"
                          className="form-control"
                          value={newImage.url}
                          onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                          placeholder="https://images.unsplash.com/..."
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Alt Text</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newImage.alt}
                          onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                          placeholder="Chocolate drip cake"
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">Save Image</button>
                    </form>
                  </div>

                  <div className="col-md-6">
                    <h5>Existing Images</h5>
                    {gallery.length === 0 ? (
                      <p className="text-muted">No gallery images found.</p>
                    ) : (
                      <div className="row g-3">
                        {gallery.map((img) => (
                          <div className="col-6" key={img.id}>
                            <div className="card">
                              <img src={img.url} alt={img.alt} className="card-img-top" />
                              <div className="card-body p-2">
                                <p className="card-text small mb-2">{img.alt}</p>
                                <button
                                  className="btn btn-outline-danger btn-sm w-100"
                                  onClick={() => handleDeleteImage(img.id)}
                                >
                                  <Trash2 size={16} /> Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('admin-root')!).render(
  <React.StrictMode>
    <AdminDashboard />
  </React.StrictMode>
);
