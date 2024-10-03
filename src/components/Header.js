import React from 'react';
import './Header.css'
import { config } from './config';

const Header = () => (
  <div className="header">
    {config.envioGratis ? `Envio gratis con una compra superior a ${config.envioGratis}€` : "Hola que tal"}
  </div>
);

//const setCookie = (name, value, days) => {
  //const expires = new Date(Date.now() + days * 864e5).toUTCString();
  //document.cookie = `${name}=${value}; path=/; expires=${expires}`;
  //console.log("Cookie añadida");
//};

// Establecer la cookie para pruebas
//setCookie('userEmail', 'admin@admin', 7);

export default Header;
