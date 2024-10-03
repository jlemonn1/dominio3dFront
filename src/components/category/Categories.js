import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from './CategoryCard';
import './Category.css'; // Asegúrate de importar los estilos CSS

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: 'Hoodies',
      productCount: 100,
      image: 'link_to_your_image_for_hoodies', // Sustituir con la URL de la imagen
      path: '/hoodies',
    },
    {
      title: 'Crewnecks',
      productCount: 45,
      image: 'link_to_your_image_for_crewnecks', // Sustituir con la URL de la imagen
      path: '/crewnecks',
    },
    {
      title: 'T-Shirts',
      productCount: 152,
      image: 'link_to_your_image_for_tshirts', // Sustituir con la URL de la imagen
      path: '/tshirts',
    },
    {
      title: 'Pants & Sweatpants',
      productCount: 34,
      image: 'link_to_your_image_for_pants', // Sustituir con la URL de la imagen
      path: '/pants',
    },
  ];

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  return (
    <div className="categories-container">
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          title={category.title}
          productCount={category.productCount}
          image={category.image}
          onClick={() => handleCategoryClick(category.path)}
        />
      ))}
    </div>
  );
};

export default Categories;
