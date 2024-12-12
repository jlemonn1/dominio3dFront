import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './admin.css';
import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyAKYBIEHieGaIr9Yl7BA-yZu6ufRaE271k",
  authDomain: "annubis-web-storage.firebaseapp.com",
  projectId: "annubis-web-storage",
  storageBucket: "annubis-web-storage.firebasestorage.app",
  messagingSenderId: "137386375071",
  appId: "1:137386375071:web:a370e57b4c5521ac726faa",
  measurementId: "G-Y001MQMZFL"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const CarouselManager = ({ config }) => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'carousel/');
        const files = await listAll(storageRef);
        const imageUrls = await Promise.all(
          files.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return { id: itemRef.name, imageUrl: url };
          })
        );
        setImages(imageUrls);
      } catch (error) {
        console.error('Error al obtener las imágenes', error);
      }
    };
    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    try {
      const uploadedImages = await Promise.all(
        Array.from(selectedFiles).map(async (file) => {
          const storageRef = ref(storage, `carousel/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return url;  // Solo devuelves la URL
        })
      );

      const url = 'http://localhost:8080/api/carousel/upload';

      const response = await fetch(url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(uploadedImages)  // Enviamos la lista de URLs como JSON
      });

      if (response.ok) {
          console.log('Imágenes subidas correctamente');
      } else {
          console.error('Error al subir las imágenes');
      }


      setImages((prevImages) => [...prevImages, ...uploadedImages]);
      setSelectedFiles([]);

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
      const imageRef = ref(storage, `carousel/${imageId}`);
      await deleteObject(imageRef);
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error('Error al eliminar imagen', error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
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
