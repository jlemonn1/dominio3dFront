import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
//import { config } from '../config';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './admin.css';

const CarouselManager = ({config}) => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/carousel`);
        const imagesWithFullUrl = response.data.map(image => ({
          ...image,
          imageUrl: `${apiUrl}${image.imageUrl}`
        }));
        setImages(imagesWithFullUrl);
      } catch (error) {
        console.error('Error al obtener las imágenes', error);
      }
    };
    fetchImages();
  }, [apiUrl]);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    Array.from(selectedFiles).forEach(file => formData.append('files', file));

    try {
      await axios.post(`${apiUrl}/api/carousel/upload`, formData);
      const response = await axios.get(`${apiUrl}/api/carousel`);
      const imagesWithFullUrl = response.data.map(image => ({
        ...image,
        imageUrl: `${apiUrl}${image.imageUrl}`
      }));
      setImages(imagesWithFullUrl);
      setSelectedFiles([]); // Limpia el estado de archivos seleccionados

      // Limpia el input de archivos de manera directa
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = ''; // Limpia el valor del input
      }
    } catch (error) {
      console.error('Error al subir imágenes', error);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      await axios.delete(`${apiUrl}/api/carousel/delete/${imageId}`);
      setImages(prevImages => prevImages.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Error al eliminar imagen', error);
    }
  };

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2, // Mostrar 2 imágenes
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="carousel-manager">
      <h3>Gestión del Carrusel</h3>

      <div className="carousel-container">
        {images.length === 0 ? (
          <p>No hay imágenes en el carrusel.</p>
        ) : images.length === 1 ? (
          <div className="carousel-item">
            <img 
              src={images[0].imageUrl} 
              alt="Carrusel" 
              className="carousel-image"
              onError={() => console.error(`Error al cargar la imagen: ${images[0].imageUrl}`)}
            />
            <button className="delete-button" onClick={() => handleDelete(images[0].id)}>Eliminar</button>
          </div>
        ) : (
          <>
            <Slider {...settings}>
              {images.map((image) => (
                <div key={image.id} className="carousel-item">
                  <img 
                    src={image.imageUrl} 
                    alt="Carrusel" 
                    className="carousel-image"
                    onError={() => console.error(`Error al cargar la imagen: ${image.imageUrl}`)}
                  />
                  <button className="delete-button" onClick={() => handleDelete(image.id)}>Eliminar</button>
                </div>
              ))}
            </Slider>
            <p className="image-count">Total de imágenes: {images.length}</p>
          </>
        )}
      </div>
      
      <div className="upload-section">
        <input type="file" multiple onChange={handleFileChange} />
        <button className="admin-button" onClick={handleUpload}>Subir Imágenes</button>
      </div>
      <div style={{ borderBottom: '1px solid #000', margin: '10px 0' }}></div>
    </div>
  );
};

export default CarouselManager;
