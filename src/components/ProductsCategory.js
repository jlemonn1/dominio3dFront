import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductsCategory.css'; // Asegúrate de importar el CSS para el contenedor de productos
import Categories from './category/Categories'; // Componente para las categorías

const ProductsCategory = ({ config }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const productRefs = useRef([]);
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  // Obtener productos
  useEffect(() => {
    // Fetch de los productos
    fetch(`${apiUrl}/api/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const filteredProducts = data.filter(product => product.locker === false && product.bestFriends === false);
        setProducts(filteredProducts);
      })
      .catch(error => console.error('Error fetching products:', error));

    // Fetch de las categorías
    fetch(`${apiUrl}/api/category`)
      .then(response => {  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Crear el "HashMap" para las categorías con imágenes
        const categoriesMap = {};

        data.forEach(category => {
          if (category.urlImg && category.urlImg.trim() !== "" && category.subCategory) {
            categoriesMap[category.subCategory] = category.urlImg;
          }else if (category.urlImg && category.urlImg.trim() !== "" && category.category) {
            categoriesMap[category.category] = category.urlImg;
          }
        });

        setCategories(categoriesMap); // Guardar el mapa en el estado
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, [apiUrl]);

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

  // Lógica para separar productos en grupos de 4
  const chunkProducts = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const productChunks = chunkProducts(products, 4);

  // Antes de este bloque, añade esta condición
const shouldShowCategories = productChunks.length > 0 && productChunks[0].length > 0;

return (
  <div className="featured-products-container"> {/* Ajustado para manejar posición relativa */}
    {productChunks.map((chunk, chunkIndex) => (
      <React.Fragment key={`chunk-${chunkIndex}`}>
        {/* Renderizar los productos de cada grupo */}
        <div className="featured-products">
          {chunk.map((product, index) => (
            <div
              className="product-card-wrapper"
              key={product.id}
              ref={el => productRefs.current[chunkIndex * 4 + index] = el}
            >
              <ProductCard 
                title={product.name}
                price={product.price}
                image={`${apiUrl}${product.images[0]}`} // Cambiado para usar la URL del servidor
                onClick={() => handleProductClick(product.id)} // Llama a handleProductClick con el ID del producto
              />
            </div>
          ))}
        </div>
        {/* Mostrar las categorías recomendadas después de cada grupo de productos, excepto después del último grupo */}
        {chunkIndex < productChunks.length - 1 && (
          <Categories config={config} />
        )}
      </React.Fragment>
    ))}
  </div>
);


};

export default ProductsCategory;
