import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route } from 'react-router-dom';
import {config } from './components/config';
import Header from './components/Header';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import FeaturedProducts from './components/FeaturedProducts';
import ProductDetails from './components/ProductDetails';
import ShippingPage from './components/ShippingPage';
import OrderProcessing from './components/OrderProcessing';
import OrderDetails from './components/OrderDetails';
import ScrollToTop from './components/ScrollToTop'; // Asegúrate de que el nombre sea correcto
import CartPage from './components/CartPage';
import DiscountsManager from './components/admin/DiscountsManager'
import ProductList from './components/admin/ProductList';
import AdminOrders from './components/admin/AdminOrders';
import CategoryPage from './components/CategoryPage';
import VideoFin from './components/VideoFin';


const App = () => {
  useEffect(() => {
    document.title = config.appName; // Establecer el título dinámicamente
  }, []);

  return (
  <div className="App">
    <ScrollToTop />
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <Navbar />
          <PromoBanner />
          <FeaturedProducts />
          {/* <VideoFin /> */}
        </>
      } />
      <Route path="/product/:id" element={
        <>
          <Header />
          <Navbar />
          <ProductDetails />
        </>
      } />
      <Route path="/envio/:email" element={
        <>
          <Header />
          <Navbar />
          <ShippingPage />
        </>
      } />
      <Route path="/cart" element={
        <>
          <Header />
          <Navbar />
          <CartPage />
        </>
      } />
      <Route path="/orderProcessing/:email/:mobileNumber/:fullAddress/:typeShipping" element={
        <>
          <OrderProcessing />
        </>
      } />
      <Route path="/orderDetails/:id" element={
        <>
          <Header />
          <Navbar />
          <OrderDetails />
        </>
      } />

      <Route path="/Dacha33" element={
        <>
          <Header />
          <Navbar />
          <AdminOrders />
          <ProductList />
          <DiscountsManager />
        </>
      } />
      <Route path="/category/:category" element={
        <>
        <Header />
        <Navbar />
        <CategoryPage/>
      </>
    } />
    </Routes>
  </div>
);

};

export default App;
