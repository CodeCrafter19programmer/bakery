import { useState } from 'react';
import { motion } from 'framer-motion';
import { products } from '../data/products';
import { CartItem } from '../types';
import ProductCard from './ProductCard';

interface ProductsProps {
  addToCart: (item: CartItem) => void;
}

const Products = ({ addToCart }: ProductsProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'cake' | 'donut' | 'pastry'>('all');

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
          transition={{ duration: 0.6 }}
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
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
