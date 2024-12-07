import React, { useState, useEffect } from 'react';
import './admin.css'; // Asegúrate de importar los estilos de administración
//import { config } from '../config';

const AdminOrders = ({config}) => {
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const apiUrl = config.apiUrl;

    useEffect(() => {
        fetch(`${apiUrl}/api/orders`)  // Cambia la URL según tu entorno de producción
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="admin-container-element">
            <h3>Ordenes</h3>
            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                <ul className="admin-list">
                    {orders.map(order => (
                        <li key={order.id} className="admin-list-item">
                            <div onClick={() => toggleOrderDetails(order.id)} className="order-summary" style={{ cursor: 'pointer' }}>
                                <div className="order-summary-item">
                                    <strong>Email:</strong> {order.userEmail}
                                </div>
                                <div className="order-summary-item">
                                    <strong>Numero:</strong> {order.mobileNumber}
                                </div>
                                <div className="order-summary-item">
                                    <strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}
                                </div>
                                <div className="order-summary-item">
                                    <strong>Dirección:</strong> {order.shippingAddress}
                                </div>
                                <div className="order-summary-item">
                                    <strong>Total:</strong> {order.totalPrice}€
                                </div>
                            </div>


                            {expandedOrderId === order.id && (
                                <div className="order-details">
                                    <strong>Items:</strong>
                                    <ul>
                                        {order.orderItems.map((item, index) => (
                                            <li key={`${item.product.name}-${item.color}-${item.size}-${index}`}>
                                                <div className="order-info">
                                                    <span><strong>Producto:</strong> {item.product.name}</span>
                                                    <span><strong> Cantidad:</strong> {item.quantity}</span>
                                                    <span><strong> Color:</strong> {item.color}</span>
                                                    <span><strong> Tamaño:</strong> {item.size}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            <div style={{ borderBottom: '1px solid #000', margin: '10px 0' }}></div>
        </div>
    );
};

export default AdminOrders;
