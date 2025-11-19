import { motion } from 'framer-motion';
import { Instagram, Music } from 'lucide-react';

const Social = () => {
  return (
    <section className="social-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title" style={{ color: 'white' }}>
            Follow Us
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Stay updated with our latest creations
          </p>
        </motion.div>

        <div className="social-icons">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram size={32} />
          </motion.a>
          <motion.a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Music size={32} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Social;
