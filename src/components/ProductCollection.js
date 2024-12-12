import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import Gif from './img/giflogo.gif'
import './ProductsCategory.css';

const ProductCollection = ({ config }) => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/products`);
        if (!response.ok) {
          throw new Error('Error fetching products data');
        }
        const data = await response.json();
        console.log(data); // Añade esta línea para verificar la estructura de datos
        
        // Filtra los productos que tienen locker y best_friend a false
        const filteredProducts = data.filter(product => product.locker === false && product.bestFriends === false);
        
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };
  
    fetchProducts();
  }, [apiUrl]);
  

  const groupedProducts = products.reduce((acc, product) => {
    const collection = product.collection || 'Sin Colección';
    if (!acc[collection]) {
      acc[collection] = [];
    }
    acc[collection].push(product);
    return acc;
  }, {});

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    productRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [products]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="product-collection">
      <img
        src={Gif} // Asegúrate de que la ruta a tu GIF sea correcta
        alt="Loading..." // Texto alternativo para el GIF
        style={{ width: '70%', display: 'block', margin: '0 auto', maxHeight: '500px' }} // Estilo para centrar y ajustar el ancho
      />
      {Object.keys(groupedProducts).length > 0 ? (
        Object.keys(groupedProducts).map((collection) => (
          <div key={collection} className="collection-wrapper">
            <h2>{collection}</h2>
            <div className="featured-products">
              {groupedProducts[collection].map((product) => (
                <div
                  key={product.id}
                  className="product-card-wrapper"
                  ref={el => productRefs.current.push(el)}
                >
                  <ProductCard 
                    title={product.name}
                    price={product.price}
                    image={`${product.images[0] || ''}`}
                    onClick={() => handleProductClick(product.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No hay productos disponibles.</p>
      )}
    </div>
  );
};

export default ProductCollection;
