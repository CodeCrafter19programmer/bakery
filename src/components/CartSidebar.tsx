import { X, Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { sendToWhatsApp } from '../utils/whatsapp';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface CartSidebarProps {
  cart: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

const CartSidebar = ({ cart, isOpen, onClose, onRemoveItem, onClearCart }: CartSidebarProps) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      // Save order via backend API
      const orderData = {
        items: cart,
        total,
        customer_message: cart.map(item => 
          `${item.name} x${item.quantity}${item.customText ? ` - "${item.customText}"` : ''}`
        ).join(', ')
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        console.error('Error saving order:', await response.text());
        // Continue with WhatsApp even if backend fails
      }

      // Send to WhatsApp
      sendToWhatsApp(cart, total);
      
      // Clear cart after successful checkout
      onClearCart();
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      // Still send to WhatsApp even if there's an error
      sendToWhatsApp(cart, total);
      onClearCart();
      onClose();
    }
  };

  return (
    <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3 className="cart-title">Your Cart</h3>
        <button className="close-cart-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="cart-items">
        {cart.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <p>Add some delicious items!</p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={`${item.id}-${index}`} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  {item.price.toLocaleString()} UGX
                </div>
                {item.customText && (
                  <div className="cart-item-custom">
                    "{item.customText}"
                  </div>
                )}
                <div className="cart-item-quantity">
                  Quantity: {item.quantity}
                </div>
              </div>
              <button
                className="remove-item-btn"
                onClick={() => onRemoveItem(index)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>{total.toLocaleString()} UGX</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout via WhatsApp
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
