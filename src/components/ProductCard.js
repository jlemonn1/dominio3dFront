import React from 'react';
import './ProductCard.css'; // Asegúrate de tener un archivo CSS si es necesario

const ProductCard = ({ title, price, image, onClick }) => {
  return (
    <div className="product-card" onClick={() => {
      console.log(`ProductCard clicked: ${title}`); // Debugging
      onClick();
    }}>
      <img src={image} alt={title} className="product-image" /> {/* Añadido una clase CSS para estilos */}
      <div className="product-info">
        <h3>{title}</h3>
        <p>{price.toFixed(2)} EUR</p> {/* Asegura que el precio tenga dos decimales */}
      </div>
    </div>
  );
};

export default ProductCard;
