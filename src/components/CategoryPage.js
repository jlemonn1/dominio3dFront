import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductsCategory.css';

const CategoryPage = ({ config }) => {
  const [products, setProducts] = useState([]);
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const { category } = useParams(); // Obtiene el parámetro de la categoría o el catId desde la URL
  const apiUrl = config.apiUrl;

  // Llamada a la API para obtener productos por catId o por nombre de categoría
  useEffect(() => {
    let url = `${apiUrl}/api/products/filter?`;

    if (!isNaN(category)) {
      // Si el parámetro es un número, busca por catId
      url += `catId=${category}`;
    } else {
      // Si el parámetro es una cadena, busca por nombre de categoría
      url += `categoryName=${category}`;
    }

    fetch(url)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching filtered products:', error));
  }, [category, apiUrl]);

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

  // Filtra productos (excluye los que tienen locker o bestFriends en true)
  const filteredProducts = products.filter(product => product.locker === false && product.bestFriends === false);

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
            image={`${apiUrl}${product.images[0]}`} // Asegúrate de que el array images exista y contenga elementos
            onClick={() => handleProductClick(product.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryPage;
