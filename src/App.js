import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import FeaturedProducts from './components/FeaturedProducts';
import ProductDetails from './components/ProductDetails';
import Hogar from './components/Hogar';
import Herramientas from './components/Herramientas';
import Ninos from './components/Ninos';
import Friki from './components/Friki';
import CartPage from './components/CartPage';
import ShippingPage from './components/ShippingPage';
import OrderProcessing from './components/OrderProcessing';
import OrderDetails from './components/OrderDetails';
import ScrollToTop from './components/ScrollToTop'; // Asegúrate de que el nombre sea correcto


const App = () => (
  <div className="App">
    <ScrollToTop />
    <Routes>
      <Route path="/" element={
        <>
          <Header />
          <Navbar />
          <PromoBanner />
          <FeaturedProducts />
        </>
      } />
      <Route path="/product/:id" element={
        <>
          <Header />
          <Navbar />
          <ProductDetails />
        </>
      } />
      <Route path="/hogar" element={
        <>
          <Header />
          <Navbar />
          <Hogar />
        </>
      } />
      <Route path="/herramientas" element={
        <>
          <Header />
          <Navbar />
          <Herramientas />
        </>
      } />
      <Route path="/ninos" element={
        <>
          <Header />
          <Navbar />
          <Ninos />
        </>
      } />
      <Route path="/friki" element={
        <>
          <Header />
          <Navbar />
          <Friki />
        </>
      } />
      <Route path="/cart" element={
        <>
          <Header />
          <Navbar />
          <CartPage />
        </>
      } />
      <Route path="/envio/:email" element={
        <>
          <Header />
          <Navbar />
          <ShippingPage />
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
    </Routes>
  </div>
);

export default App;
