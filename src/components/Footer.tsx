import { Cake, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-title">
            <Cake size={32} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Genesis Cakes
          </div>
          <p className="footer-text">
            <MapPin size={16} style={{ display: 'inline', marginRight: '0.3rem' }} />
            Naluvule, Nansana, Wakiso
          </p>
          <p className="footer-text">
            <Phone size={16} style={{ display: 'inline', marginRight: '0.3rem' }} />
            0778087986
          </p>
          <p className="footer-text mt-3">
            Handcrafted cakes and pastries made with love
          </p>
        </div>
        
        <div className="developer-credit">
          <p>
            Developed by <span className="developer-name">Ntale Stephen</span>
          </p>
          <p>Contact: 0778087986</p>
          <p className="mt-2">© 2024 Genesis Cakes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
