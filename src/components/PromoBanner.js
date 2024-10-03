import React, { useState, useEffect } from 'react';
import './PromoBanner.css';
import imgSmall from './img/movil.jpg';
import imgLarge from './img/pc.jpg';
import {config} from './config';

const PromoBanner = () => {
  const [currentImage, setCurrentImage] = useState(imgSmall);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 600px)').matches) {
        setCurrentImage(imgLarge);
      } else {
        setCurrentImage(imgSmall);
      }
    };

    // Ejecutar la función al cargar el componente
    handleResize();

    // Escuchar cambios en el tamaño de la pantalla
    window.addEventListener('resize', handleResize);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleScroll = () => {
    window.scrollBy({ top: 520, left: 0, behavior: 'smooth' });
  };

  return (
    <div className="promo-banner">
      <div className="promo-video">
        <img 
          src={currentImage} 
          alt="Inicio Promo" 
        />
      </div>
      <div className="promo-content">
        <button className="shop-now" onClick={handleScroll}>Shop now 🫶🏽</button>
      </div>
      <p>{config.lineaUno || ''}</p>
      <p>{config.lineaDos || ''}</p>
      <p>{config.lineaTres || ''}</p>
    </div>
  );
};

export default PromoBanner;
