import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import ProductsCategory from './components/ProductsCategory';
import ProductDetails from './components/ProductDetails';
import ShippingPage from './components/ShippingPage';
import OrderProcessing from './components/OrderProcessing';
import OrderDetails from './components/OrderDetails';
import OrdenProducts from './components/OrdenProducts';
import ScrollToTop from './components/ScrollToTop'; // Asegúrate de que el nombre sea correcto
import CartPage from './components/CartPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import CategoryPage from './components/CategoryPage';
import AboutUs from './components/AboutUs';
import Restock from './components/Restock';
import Best from './components/Best';
import Locker from './components/Locker';
import ProductCollection from './components/ProductCollection';
import VideoFin from './components/VideoFin';
import CategoryList from './components/CategoryList';


// Config inicial
const initialConfig = {
  apiUrl: 'https://annubis.co',
  appName: 'annubis',
  correo: 'annubis.co.info@gmail.com',
  password : 'Dacha33',

  envioGratis: '70',
  textBanner1: 'Annubis Cøllectiøn All rights reserved',
  textBanner2: 'Limited Units | No Restock',
  
  tiktok :'annubis.co?_t=8pxVIfRQge8&_r=1',
  instagram: 'annubis.co',
  whatsapp :'',
  
  lineaUno: 'FOR ALL THE LOVERS',
  lineaDos: 'MY DEMONS WON TODAY',
  lineaTres: 'NO RESTOCKS.',
  botonComprar: 'Shop now 🫶🏽',
  
  textFooter: '© AnnubisCo',

  video: false,
  theme: {
    background: '#f7e4bd', //Navbar
    //Navbar: categorias, hamburguesa, icoBuscar, carrito
    text: 'rgba(26, 16, 16, 0.75)',
    textHover: 'rgba(26, 16, 16, 1)',

    //Icono buscar en el desplegable
    buttonBg: '#d41f1f', 
    buttonHover: '#d2c2a1',
   
    //Letrero arriba del todo
    colorBackgroundBanner: '#333333',
    colorTextBanner: '#FFFFFF',

    //Boton shopNow del medio
    colorBackgroundShopnow : '#f7e4bd',
    colorTextBorderShopnow : '#d41f1f',
  }
};

const App = () => {
  const [config, setConfig] = useState(initialConfig); // Inicializa el estado de la configuración

  useEffect(() => {
    document.title = config.appName; // Establecer el título dinámicamente
    applyTheme(config);
  }, [config]); // Asegúrate de actualizar el título cuando cambie el nombre de la app

  useEffect(() => {
    const fetchConfigFromApi = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/config`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiResponse = await response.json();
        setConfig((prevConfig) => ({
          ...prevConfig,
          ...apiResponse,
        })); // Actualiza el estado con la nueva configuración
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
      }
    };

    fetchConfigFromApi(); // Llama a la función para obtener la configuración
  }, []); // Solo se ejecuta una vez al montar el componente

  const applyTheme = (config) => {
    const root = document.documentElement;
    root.style.setProperty('--color-background', config.theme.background);
    root.style.setProperty('--color-text', config.theme.text);
    root.style.setProperty('--color-text-hover', config.theme.textHover);
    root.style.setProperty('--color-navbar-bg', config.theme.background);
    root.style.setProperty('--color-offcanvas-bg', config.theme.background);
    root.style.setProperty('--color-button-bg', config.theme.buttonBg);
    root.style.setProperty('--color-button-hover', config.theme.buttonHover);
    root.style.setProperty('--color-icon', config.theme.text);
    root.style.setProperty('--color-icon-hover', config.theme.textHover);
    root.style.setProperty('--color-banner', config.theme.colorBackgroundBanner);
    root.style.setProperty('--color-text-banner', config.theme.colorTextBanner);
    root.style.setProperty('--color-background-shopnow', config.theme.colorBackgroundShopnow);
    root.style.setProperty('--color-text-border-shopnow', config.theme.colorTextBorderShopnow);
    root.style.setProperty('--footer-bg-color', config.theme.colorFooterBg);
    root.style.setProperty('--footer-text-color', config.theme.colorFooterText);
  };

  return (
    <div className="App">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <PromoBanner config={config} />
            <ProductsCategory config={config} />
            <CategoryList config={config} />
            <VideoFin />
          </>
        } />
        <Route path="/product/:id" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <ProductDetails config={config} />
          </>
        } />
        <Route path="/envio/:email" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <ShippingPage config={config} />
          </>
        } />
        <Route path="/cart" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <CartPage config={config} />
            
          </>
        } />
        <Route path="/orderProcessing/:email/:mobileNumber/:fullAddress/:typeShipping" element={
          <>
            <OrderProcessing config={config} />
          </>
        } />
        <Route path="/orderDetails/:id" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <OrderDetails config={config} />
          </>
        } />
        <Route path="/manage" element={
          <ProtectedRoute config={config} />
        } />
        <Route path="/about" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <AboutUs config={config} />
          </>
        } />
        <Route path="/restock" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <Restock config={config} />
          </>
        } />
        <Route path="/best" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <Best config={config} />
          </>
        } />
        <Route path="/locker" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <Locker config={config} />
          </>
        } />
        <Route path="/collections" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <ProductCollection config={config} />
          </>
        } />
        <Route path="/category/:category" element={
          <>
            <Header config={config} />
            <Navbar config={config} />
            <CategoryPage config={config} />
          </>
        } />
      </Routes>
    </div>
  );
};

export default App;
