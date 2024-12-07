// src/components/ProtectedRoute.js
import React, { useState } from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import AdminOrders from './AdminOrders';
import ProductList from './ProductList';
import DiscountsManager from './DiscountsManager';
import ConfigManager from './ConfigManager';
import CarouselManager from './CarouselManager';
import Bestfriends from './Bestfriends';
import CategoryAdmin from './CategoryAdmin';
//import { config } from '../config';
import './admin.css'; // Asegúrate de importar el archivo CSS

const ProtectedRoute = ({config}) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    const correctPassword = config.password; // Cambia esto por la contraseña que desees
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  return (
    <div className="admin-container">
      {!isAuthenticated ? (
        <form className="admin-form" onSubmit={handleLogin} style={{ backgroundColor: 'transparent', border: 'none' }}>
          <h2>Ingresa la contraseña</h2>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit" className="admin-button">Acceder</button>
        </form>
      ) : (
        <>
          <Header config={config} />
          <Navbar config={config}/>
          <AdminOrders config={config}/>
          <ProductList config={config}/>
          <DiscountsManager config={config}/>
          <CarouselManager config={config}/>
          <ConfigManager config={config}/>
          <Bestfriends config={config}/>
          <CategoryAdmin config={config}/>
          
          
        </>
      )}
    </div>
  );
};

export default ProtectedRoute;
