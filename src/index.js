import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
