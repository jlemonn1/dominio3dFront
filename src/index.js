import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';  
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { config } from './components/config'; // Importar el archivo de configuración

// Función para aplicar el tema
function applyTheme() {
  const root = document.documentElement;

  // Cambiar las variables CSS usando los valores del config
  //root.style.setProperty('--color-background', config.theme.background);
  //root.style.setProperty('--color-text', config.theme.text);
  //root.style.setProperty('--color-text-hover', config.theme.textHover);
  //root.style.setProperty('--color-navbar-bg', config.theme.background);
  //root.style.setProperty('--color-offcanvas-bg', config.theme.background);
  //root.style.setProperty('--color-button-bg', config.theme.buttonBg);
  //root.style.setProperty('--color-button-hover', config.theme.buttonHover);
  //root.style.setProperty('--color-icon', config.theme.text);
  //root.style.setProperty('--color-icon-hover', config.theme.textHover);
  //root.style.setProperty('--color-banner', config.theme.colorBackgroundBanner);
  //root.style.setProperty('--color-text-banner', config.theme.colorTextBanner);
  //root.style.setProperty('--color-background-shopnow', config.theme.colorBackgroundShopnow);
  //root.style.setProperty('--color-text-border-shopnow', config.theme.colorTextBorderShopnow);
  //root.style.setProperty('--footer-bg-color', config.theme.colorFooterBg);
  //root.style.setProperty('--footer-text-color', config.theme.colorFooterText);
  
}

// Llama a la función para aplicar el tema antes de renderizar la aplicación
applyTheme();

// Crear el root de la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación dentro de BrowserRouter para usar el enrutamiento
root.render(
  //<React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  //</React.StrictMode>
);
