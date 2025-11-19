import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Products from './components/Products';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Social from './components/Social';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { CartItem } from './types';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        cartItem => cartItem.id === item.id && cartItem.customText === item.customText
      );

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id && cartItem.customText === item.customText
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...prevCart, item];
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <>
      <Navbar cartCount={cart.length} onCartClick={toggleCart} />
      <Hero />
      <Products addToCart={addToCart} />
      <Gallery />
      <Location />
      <Social />
      <Footer />
      <CartSidebar
        cart={cart}
        isOpen={isCartOpen}
        onClose={toggleCart}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
      <div 
        className={`cart-overlay ${isCartOpen ? 'show' : ''}`}
        onClick={toggleCart}
      />
    </>
  );
}

export default App;
