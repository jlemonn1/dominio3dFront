import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './admin.css';
//import { config } from '../config';

const DiscountsManager = ({config}) => {
    const [discounts, setDiscounts] = useState([]);
    const [newDiscount, setNewDiscount] = useState({ nombre: '', porcentaje: 0, numVidas: 0 });
    const apiUrl = config.apiUrl;

    // Uso de useCallback para evitar la recreación de la función en cada render
    const fetchDiscounts = useCallback(async () => {
        const response = await axios.get(`${apiUrl}/api/discounts`);
        setDiscounts(response.data);
    }, [apiUrl]);

    useEffect(() => {
        fetchDiscounts(); // fetchDiscounts ahora es una dependencia que no cambia innecesariamente
    }, [fetchDiscounts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewDiscount({ ...newDiscount, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${apiUrl}/api/discounts`, newDiscount);
        setNewDiscount({ nombre: '', porcentaje: 0, numVidas: 0 });
        fetchDiscounts();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${apiUrl}/api/discounts/${id}`);
        fetchDiscounts();
    };

    return (
        <div className="admin-container-element">
            <h3>Descuentos</h3>
            <form onSubmit={handleSubmit} className="admin-form">
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={newDiscount.nombre} onChange={handleChange} required />
                </label>
                <label>
                    Porcentaje:
                    <input type="number" name="porcentaje" value={newDiscount.porcentaje} onChange={handleChange} required />
                </label>
                <label>
                    Número de Vidas:
                    <input type="number" name="numVidas" value={newDiscount.numVidas} onChange={handleChange} required />
                </label>
                <button type="submit" className="admin-button">Añadir Descuento</button>
            </form>
            <ul className="admin-list">
                {discounts.map(discount => (
                    <li key={discount.id} className="admin-list-item">
                        <span>{discount.nombre} - {discount.porcentaje}% - {discount.numVidas} vidas</span>
                        <button onClick={() => handleDelete(discount.id)} className="admin-button admin-button-delete">Eliminar</button>
                    </li>
                ))}
            </ul>
            <div style={{ borderBottom: '1px solid #000', margin: '10px 0' }}></div>
        </div>
    );
};

export default DiscountsManager;
