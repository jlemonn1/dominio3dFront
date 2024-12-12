// src/components/ProductItem.js  
import React from 'react';
import './admin.css';
//import { config } from '../config';

const ProductItem = ({ product, onEdit, onDelete, config }) => {

    // Usa las rutas de las imágenes directamente en el src de las etiquetas <img>
    const images = product.images && product.images.length > 0
        ? product.images
        : []; // Default to an empty array if images is undefined or empty

    return (
        <li className="admin-list-item">
            <div className="product-header">
                <h3>{product.name}</h3>
                <p>{product.price}€</p>
            </div>
            <div>
                {images.length > 0 ? (
                    images.map((src, index) => (
                        <img
                            key={index}
                            src={`${src}`}
                            alt={`${product.name} - ${index + 1}`}
                            className="product-image"
                        />
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>
            <div className="admin-item-actions">
                <button className="admin-button" onClick={() => onEdit(product)}>Editar</button>
                <button className="admin-button admin-button-delete" onClick={() => onDelete(product.id)}>Eliminar</button>
            </div>
        </li>
    );
};

export default ProductItem;
