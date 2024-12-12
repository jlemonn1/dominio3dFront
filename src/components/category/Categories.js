import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './Category.css'; // Asegúrate de tener el CSS adecuado

const Categories = ({ config }) => {
  const [categories, setCategories] = useState({});

  // Configuración del carrusel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Número de tarjetas que se mostrarán en cada slide
    slidesToScroll: 1,
    autoplay: true, // Habilitar desplazamiento automático
    autoplaySpeed: 3000, // Velocidad en milisegundos (3000 ms = 3 segundos)
  };

  // Fetch de las categorías
  useEffect(() => {
    fetch(`${config.apiUrl}/api/category/categoriesToShow`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching categories');
        }
        return response.json();
      })
      .then(data => {
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, [config.apiUrl]);

  return (
    <div className="categories-container">
      <Slider {...settings}>
        {Object.keys(categories).length > 0 ? (
          Object.entries(categories).map(([subCategory, urlImg], index) => (
            <div key={index} className="category-card" onClick={() => window.location.href = `/category/${subCategory}`}>
              <div className="category-background" style={{ backgroundImage: `url(${urlImg})` }}>
                <div className="category-info">
                  <h3 className="category-title-main">{subCategory}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No hay categorías disponibles</div>
        )}
      </Slider>
    </div>
  );
};

export default Categories;
