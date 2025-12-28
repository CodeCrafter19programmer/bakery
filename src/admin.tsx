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
const TOKEN_KEY = 'admin_token';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
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

  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
  const [uploadingImage, setUploadingImage] = useState(false);

  const [newImage, setNewImage] = useState({
    url: '',
    alt: '',
  });

  // Check for existing token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, []);

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

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setIsLoggedIn(true);
        setPassword('');
      } else {
        alert(data.error || 'Invalid credentials');
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
      const response = await fetch(`${API_URL}/api/products`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchGallery = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery/products`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: getAuthHeaders(),
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    const token = localStorage.getItem(TOKEN_KEY);
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: newProduct.name,
        price: Number(newProduct.price),
        description: newProduct.description,
        image: newProduct.image,
        category: newProduct.category,
      };

      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      setNewProduct({ name: '', price: '', description: '', image: '', category: 'cake' });
      fetchProducts();
      fetchGallery();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newImage),
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      setNewImage({ url: '', alt: '' });
      fetchGallery();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok && response.status !== 204) {
        throw new Error('Failed to delete image');
      }

      setGallery((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'completed') => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      if (response.status === 401) {
        handleLogout();
        return;
      }
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Show loading while verifying token
  if (isVerifying) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h1 className="login-title">Loading...</h1>
        </div>
      </div>
    );
  }

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
                        <label className="form-label">Image</label>
                        <div className="btn-group w-100 mb-2" role="group">
                          <button
                            type="button"
                            className={`btn btn-sm ${imageInputType === 'url' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setImageInputType('url')}
                          >
                            URL
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${imageInputType === 'upload' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setImageInputType('upload')}
                          >
                            Upload
                          </button>
                        </div>
                        {imageInputType === 'url' ? (
                          <input
                            type="url"
                            className="form-control"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            required={!newProduct.image}
                          />
                        ) : (
                          <>
                            <input
                              type="file"
                              className="form-control"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) {
                                    setNewProduct({ ...newProduct, image: url });
                                  }
                                }
                              }}
                              disabled={uploadingImage}
                            />
                            {uploadingImage && <small className="text-muted">Uploading...</small>}
                          </>
                        )}
                        {newProduct.image && (
                          <div className="mt-2">
                            <img src={newProduct.image} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                          </div>
                        )}
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
