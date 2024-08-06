import React from 'react';
import './ProductCard.css'; // Asegúrate de tener un archivo CSS si es necesario

const ProductCard = ({ title, price, image, onClick }) => {
  return (
    <div className="product-card" onClick={() => {
      console.log(`ProductCard clicked: ${title}`); // Debugging
      onClick();
    }}>
      <img src={image} alt={title} />
      <div className="product-info">
        <h3>{title}</h3>
        <p>{price} EUR</p>
      </div>
    </div>
  );
};


export default ProductCard;
