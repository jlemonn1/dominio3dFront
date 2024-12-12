import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import Gif from './img/giflocker.gif'
import './ProductsCategory.css';

const Locker = ({ config }) => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  // Llamada a la API para obtener productos al montar el componente
  useEffect(() => {
    const fetchProtectedData = async () => {

      try {
        const response = await fetch(`${apiUrl}/api/products/locker-products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching protected data'); // Manejo de errores
        }

        // Usamos response.json() para obtener el objeto JSON
        const data = await response.json(); // Asegúrate de que el servidor retorne un JSON
        console.log('Fetched data:', data);
        setProducts(data); // Establece productos
      } catch (error) {
        console.error('Error fetching protected data:', error);
      }
    };

    fetchProtectedData(); // Llama a la función de obtención de datos
  }, [apiUrl, navigate]); // Agrega 'apiUrl' y 'navigate' a las dependencias

  // Configuración del IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // 20% del elemento está visible
      }
    );

    productRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [products]);

  // Maneja el clic en los productos
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div style={{ backgroundColor: '#DDD' , minHeight: '1200px', paddingBottom:'70px' }} >
    <img
        src={Gif} // Asegúrate de que la ruta a tu GIF sea correcta
        alt="Loading..." // Texto alternativo para el GIF
        style={{ width: '70%', display: 'block', margin: '0 auto', maxHeight: '500px' }} // Estilo para centrar y ajustar el ancho
      />
    <p style={{ width: '70%', display: 'block', margin: '0 auto' }}>
    Este es el LOCKER donde se guardan las viejas  colecciones de Annubis, date un paseo y observa lo que te has perdido, que no te pase con las nuevas colecciones &lt;3
    </p>
    <div className="featured-products" >
      {products.length > 0 ? (
        products.map((product, index) => (
          <div
            key={product.id}
            className="product-card-wrapper"
            ref={el => productRefs.current[index] = el}
          >
            <ProductCard 
              title={product.name}
              image={`${product.images[0]}`} // Asegúrate de que el array images exista y contenga elementos
              onClick={() => handleProductClick(product.id)}
            />
          </div>
        ))
      ) : (
        <p>No hay productos de Locker aún.</p> // Mensaje cuando la lista está vacía
      )}
    </div>
    </div>
  );
};

export default Locker;
