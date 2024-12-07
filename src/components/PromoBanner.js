import React, { useState, useEffect } from 'react';
import './PromoBanner.css';
//import imgSmall from './img/movil.png';
//import imgLarge from './img/pc.png';

import Slider from 'react-slick';
import axios from 'axios';

const PromoBanner = ({ config }) => {
  //const [currentImage, setCurrentImage] = useState(imgSmall);
  const [images, setImages] = useState([]);
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/carousel`);
        const imagesWithFullUrl = response.data.map(image => ({
          ...image,
          imageUrl: `${apiUrl}${image.imageUrl}`,
        }));
        setImages(imagesWithFullUrl);
      } catch (error) {
        console.error('Error al obtener las imágenes', error);
      }
    };
    fetchImages();
  }, [apiUrl]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true, // Reproducción automática
    autoplaySpeed: 3000, // Cambiar cada 3 segundos
    arrows: false, // Sin flechas de navegación
    fade: true, // Transición suave
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 600px)').matches) {
        //setCurrentImage(imgLarge);
      } else {
        //setCurrentImage(imgSmall);
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
      <Slider {...settings}>
        {images.map((image) => (
          <div key={image.id} className="carousel-item">
            <img
              src={image.imageUrl}
              alt="Carrusel"
              className="carousel-image"
              onError={() => console.error(`Error al cargar la imagen: ${image.imageUrl}`)}
            />
          </div>
        ))}
      </Slider>
      </div>
      <div className="promo-content">
        <button className="shop-now" onClick={handleScroll}>{config.botonComprar}</button>
      </div>
      <p>{config.lineaUno || ''}</p>
      <p>{config.lineaDos || ''}</p>
      <p>{config.lineaTres || ''}</p>
    </div>
  );
};

export default PromoBanner;