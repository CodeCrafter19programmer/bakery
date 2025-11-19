import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const Location = () => {
  return (
    <section id="location" className="section location-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Find Us</h2>
          <p className="section-subtitle">
            Visit us or order for delivery
          </p>
        </motion.div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div
              className="location-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <MapPin className="location-icon" size={64} />
              <h3 className="location-text">We're Located In</h3>
              <p className="location-address">
                Naluvule, Nansana<br />
                Kampala, Uganda
              </p>
              <p className="mt-4" style={{ color: 'var(--text-light)' }}>
                Order via WhatsApp for delivery or pickup
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
