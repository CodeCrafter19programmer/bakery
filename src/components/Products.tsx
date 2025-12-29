import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CartItem, Product } from '../types';
import ProductCard from './ProductCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface ProductsProps {
  addToCart: (item: CartItem) => void;
}

const Products = ({ addToCart }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cake' | 'donut' | 'pastry'>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'cake', label: 'Cakes' },
    { id: 'donut', label: 'Donuts' },
    { id: 'pastry', label: 'Pastries' }
  ];

  return (
    <section id="products" className="section products-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="section-title">Our Delicious Products</h2>
          <p className="section-subtitle">
            Freshly baked every day with premium ingredients
          </p>
        </motion.div>

        <div className="category-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id as any)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="row g-4">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
              >
                <ProductCard product={product} addToCart={addToCart} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
