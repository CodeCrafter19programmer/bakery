import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="hero-title">
                Delicious Cakes & Donuts
              </h1>
              <p className="hero-subtitle">
                Handcrafted with love in Naluvule, Nansana. 
                Custom cakes for every special occasion!
              </p>
              <div className="d-flex flex-wrap">
                <a href="#gallery" className="btn-primary-custom">
                  View Gallery
                </a>
                <a href="#products" className="btn-outline-custom">
                  Order Now
                </a>
              </div>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              className="hero-image"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80"
                alt="Beautiful birthday cake"
                className="img-fluid"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
