import { motion } from 'framer-motion';
import { galleryImages } from '../data/products';
import { Eye } from 'lucide-react';

const Gallery = () => {
  return (
    <section id="gallery" className="section gallery-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Our Gallery</h2>
          <p className="section-subtitle">
            Browse our collection of beautiful custom cakes
          </p>
        </motion.div>

        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="gallery-item"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={image.url} alt={image.alt} />
              <div className="gallery-overlay">
                <Eye size={48} color="white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
