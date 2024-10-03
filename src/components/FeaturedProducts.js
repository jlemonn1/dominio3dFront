import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './FeaturedProducts.css'; // Asegúrate de importar el CSS para el contenedor de productos
import Categories from './category/Categories';
import { config } from './config';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

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

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="featured-products">
      {products.map((product, index) => (
        <React.Fragment key={product.id}>
          <div
            className="product-card-wrapper"
            ref={el => productRefs.current[index] = el}
          >
            <ProductCard 
              title={product.name}
              price={product.price}
              image={`${apiUrl}${product.images[0]}`} // Cambiado para usar la URL del servidor
              onClick={() => handleProductClick(product.id)} // Llama a handleProductClick con el ID del producto
            />
          </div>

          {/* Mostrar el componente intermedio después de los primeros 5 productos */}
          {/*(index + 1) % 2 === 0 && index + 1 < products.length && (
            <div className="full-width-category">
              <Categories />
            </div>
          ) */}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FeaturedProducts;
