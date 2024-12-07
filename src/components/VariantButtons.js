import React, { useState } from "react";
import "./VariantButtons.css"; // Archivo CSS externo para estilos

const VariantButtons = ({ variants, onSelectVariant }) => {
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSelectVariant = (size) => {
    setSelectedSize(size);
    onSelectVariant(size); // Notifica a ProductDetails
  };

  return (
    <div className="variant-buttons">
      {Object.entries(variants).map(([size, stock]) => (
        <button
          key={size}
          onClick={() => stock > 0 && handleSelectVariant(size)}
          className={`variant-button ${stock === 0 ? "disabled" : ""} ${selectedSize === size ? "selected" : ""}`}
          disabled={stock === 0}
          style={{ color: stock === 0 ? 'gray' : 'black' }}
        >
          {size}
        </button>
      ))}
    </div>

  );
};

export default VariantButtons;
