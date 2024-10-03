import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { config } from './config';

import './OrderProcessing.css'; // Ajusta la ruta si es necesario

const OrderProcessing = () => {


  const navigate = useNavigate();
  const { email, mobileNumber, fullAddress, typeShipping } = useParams();

  const [orderCreated, setOrderCreated] = useState(false);
  const [effectRun, setEffectRun] = useState(false); // Estado para controlar la ejecución del efecto
  const apiUrl = config.apiUrl;



  useEffect(() => {
    if (!effectRun && email && mobileNumber && fullAddress && !orderCreated) {
      setEffectRun(true); // Asegurarse de que el efecto solo se ejecute una vez

      const checkCartExists = async () => {
        try {


          const cartResponse = await fetch(`${apiUrl}/api/carts/email/${email}`);
          
          if (!cartResponse.ok) {
            throw new Error('No se encontró un carrito para el correo electrónico proporcionado.');
          }

          const cart = await cartResponse.json();

          // Verificar que el carrito tiene un ID válido
          if (cart && cart.id !== null) {
            await createOrderFromCart();
          } else {
          }
        } catch (error) {

        }
      };

      const createOrderFromCart = async () => {
        try {

          const response = await fetch(`${apiUrl}/api/orders/from-cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              email: email,
              shippingAddress: fullAddress,
              mobileNumber: mobileNumber,
              typeShipping: typeShipping,
            }),
          });

          if (!response.ok) {
            throw new Error('Error al crear la orden');
          }

          const order = await response.json();

          await verifyPurchase(order.id);
          setOrderCreated(true);
        } catch (error) {
        }
      };

      const verifyPurchase = async (orderId) => {
        try {

          const response = await fetch(`${apiUrl}/api/checkout/verify-purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              orderId: orderId,
            }),
          });

          if (!response.ok) {
            throw new Error('Error al verificar la compra');
          }

          navigate(`/orderDetails/${orderId}`);
        } catch (error) {
        }
      };

      checkCartExists();
    } else {
    }
  }, [email, fullAddress, mobileNumber, orderCreated, navigate, effectRun, typeShipping]);

  return (
    <div className="loader-container"> {/* Añade esta clase */}
      <div className="loader"></div>
    </div>
  );
};

export default OrderProcessing;
