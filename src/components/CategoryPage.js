import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { config } from './config';
import './FeaturedProducts.css';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const { category } = useParams(); // Obtiene el parámetro de la categoría desde la URL
  const apiUrl = config.apiUrl;

  // Llamada a la API para obtener productos al montar el componente y cuando cambie la categoría
  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, [category]); // Añade 'category' a las dependencias para volver a cargar cuando cambie

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

  // Filtra los productos por categoría
  const filteredProducts = products.filter(product => product.category === category);

  return (
    <div className="featured-products">
      {filteredProducts.map((product, index) => (
        <div
          key={product.id}
          className="product-card-wrapper"
          ref={el => productRefs.current[index] = el}
        >
          <ProductCard 
            title={product.name}
            price={product.price}
            image={`apiUrl${product.images[0]}`} // Asegúrate de que el array images exista y contenga elementos
            onClick={() => handleProductClick(product.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
