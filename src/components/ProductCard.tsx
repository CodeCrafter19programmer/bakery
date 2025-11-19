import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductCardProps {
  product: Product;
  addToCart: (item: CartItem) => void;
}

const ProductCard = ({ product, addToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...product,
      quantity,
      customText: customText.trim() || undefined
    };
    addToCart(cartItem);
    
    // Reset form
    setQuantity(1);
    setCustomText('');
    
    // Show feedback
    alert(`Added ${product.name} to cart!`);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        className="product-image"
      />
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()} UGX</p>
        <p className="product-description">{product.description}</p>
        
        {product.category === 'cake' && (
          <textarea
            className="custom-text-input"
            placeholder="Custom text for cake (optional)"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            rows={2}
          />
        )}
        
        <div className="quantity-selector">
          <button className="quantity-btn" onClick={decrementQuantity}>
            <Minus size={16} />
          </button>
          <span className="quantity-display">{quantity}</span>
          <button className="quantity-btn" onClick={incrementQuantity}>
            <Plus size={16} />
          </button>
        </div>
        
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
