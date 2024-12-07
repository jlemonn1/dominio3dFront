import React, { useEffect, useState } from 'react';
import { FaInstagram, FaEnvelope, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
//import { config } from './config';

import './OrderDetails.css';

const OrderDetails = ({config}) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/orders/${id}`);

        if (!response.ok) {
          throw new Error('Error al obtener los detalles de la orden');
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Reemplaza los guiones por espacios en la dirección de envío
  const formatAddress = (address) => {
    return address.replace(/-/g, ' ');
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="order-details-container">
      <h1 className="order-details-title">Pedido Confirmado</h1>
      {order ? (
        <div className="order-details">
          <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            <p><span>ID de la Orden:</span> 2024-{order.id}</p>
            <p><span>Email:</span> {order.userEmail}</p>
            <p><span>Teléfono:</span> {order.mobileNumber}</p>
            <p><span>Precio Total:</span> <strong>{order.totalPrice.toFixed(2)}€</strong></p>
            <p><span>Dirección:</span> {formatAddress(order.shippingAddress)}</p>
          </div>

          <div className="order-thanks">
            <h2>¡Gracias por su Pedido!</h2>
            <p>Hemos recibido su pedido y estamos procesándolo. Se ha enviado un correo de confirmación a <strong>{order.userEmail}</strong>. Por favor, revise su bandeja de entrada para más detalles.</p>
            <p>Si tiene alguna pregunta o hay algún problema con su pedido, no dude en <a href="mailto:support@yourcompany.com">contactarnos</a>. Estamos aquí para ayudarle.</p>
            <p>Esperamos verle pronto :)</p>
            <div className="d-flex justify-content-center iconos">
              <a href={`mailto:${config.correo}`} className="social-icon">
                <FaEnvelope />
              </a>
              {config.tiktok ? <a href={`https://www.tiktok.com/@${config.tiktol}?_t=8pxVIfRQge8&_r=1`} className="social-icon"><FaTiktok /></a> : '' }
              {config.instagram ? <a href={ `https://www.instagram.com/${config.instagram}`} className="social-icon"><FaInstagram /></a> : '' }
              {config.whatsapp ? <a href={ `https://wa.me/34${config.whatsapp}`} className="social-icon"><FaWhatsapp /></a> : '' }
            </div>
          </div>
        </div>
      ) : (
        <p>No se encontró la orden.</p>
      )}
    </div>
  );
};

export default OrderDetails;
