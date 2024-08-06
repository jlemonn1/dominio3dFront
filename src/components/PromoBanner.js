import React from 'react';
import video from './img/inicio.mp4';
import './PromoBanner.css';

const PromoBanner = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 520, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="promo-banner">
      <div className="promo-video">
        <video autoPlay loop muted playsInline>
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button className="shop-now" onClick={handleScroll}>Shop now 🔥</button>
      <p>🔥 Productos de impresión 3D.</p>
      <p>✨ Hecho en España.</p>
      <p>⚡ Impresión personalizada</p>
    </div>
  );
};

export default PromoBanner;


