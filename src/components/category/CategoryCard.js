import React from 'react';
import './Category.css'; // Asegúrate de agregar estilos personalizados

const CategoryCard = ({ image, title, productCount, onClick }) => {
  return (
    <div className="category-card" onClick={onClick}>
      <img src={image} alt={title} className="category-image" />
      <div className="category-info">
        <h3 className="category-title-main">{title}</h3>
        <p className="category-count">{productCount} products</p>
      </div>
    </div>
  );
};

export default CategoryCard;
