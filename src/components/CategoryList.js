import React, { useState, useEffect } from 'react';
import { List } from '@mui/material';
import './CategoryList.css';

const CategoryList = ({ config }) => {
  const [categories, setCategories] = useState({});

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
    <div className="category-list-container">
      <List style={{ overflowY: 'auto' }}>
        {Object.entries(categories).length > 0 ? (
          Object.entries(categories).map(([subCategory, urlImg], index) => (
            <div
              key={index}
              className="category-item"
              style={{ backgroundImage: `url(${urlImg})` }}
              onClick={() => window.location.href = `/category/${subCategory}`}
            >
              <div className="category-overlay">
                <div className="category-title-main">{subCategory}</div>
              </div>
            </div>
          ))
        ) : (
          <div>No hay categorías disponibles</div>
        )}
      </List>
    </div>
  );
};

export default CategoryList;
