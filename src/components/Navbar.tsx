import { useState } from 'react';
import { Cake, ShoppingCart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    // Close the menu after navigating on small screens
    setIsOpen(false);
  };

  const handleCartClick = () => {
    onCartClick();
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#home" onClick={handleNavClick}>
          <Cake size={32} />
          Genesis Cakes
        </a>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse${isOpen ? ' show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#home" onClick={handleNavClick}>Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#products" onClick={handleNavClick}>Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#gallery" onClick={handleNavClick}>Gallery</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#location" onClick={handleNavClick}>Location</a>
            </li>
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link position-relative"
                onClick={handleCartClick}
                style={{ border: 'none', background: 'none' }}
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
