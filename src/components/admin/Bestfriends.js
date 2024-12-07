import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import './admin.css'; // Asegúrate de importar los estilos de administración

const Bestfriends = ({ config }) => {
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState('');
    const [viewEmails, setViewEmails] = useState(false);
    const apiUrl = config.apiUrl;

    useEffect(() => {
        fetch(`${apiUrl}/api/best-friends/emails`)
            .then(response => response.json())
            .then(data => setEmails(data))
            .catch(error => console.error('Error fetching emails:', error));
    }, [apiUrl, newEmail]);

    const handleView = () => {
        setViewEmails(!viewEmails);
    };

    const handleEmailChange = (event) => {
        setNewEmail(event.target.value);
    };

    const handleAddEmail = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/best-friends/singup?email=${encodeURIComponent(newEmail)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }

            console.log("Añadido");
            setNewEmail(''); // Limpia el campo de entrada después de añadir
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    };

    const handleDelete = async (emailToDelete) => {
        try {
            const response = await fetch(`${apiUrl}/api/best-friends/?email=${encodeURIComponent(emailToDelete)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la red');
            }

            console.log("Eliminado");
            setEmails(prevEmails => prevEmails.filter(email => email !== emailToDelete)); // Actualiza el estado
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    };

    return (
        <div className='bf'>
            <h3 style={{ marginLeft: '0px' }}>Friends & Family</h3>
            <h4 onClick={handleView} style={{ cursor: 'pointer' }}>Emails</h4>
            {viewEmails && (
                <div className="emails">
                {emails.map((email, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginRight: '10px' }}>{email}</p>
                        <FaTrash onClick={() => handleDelete(email)} style={{ cursor: 'pointer' }} />
                    </div>
                ))}
            </div>
            )}
            <input 
                value={newEmail} 
                onChange={handleEmailChange} 
                placeholder='Introduce el nuevo email' 
                style={{width:'100%', marginTop: '10px'}}
            />
            <button onClick={handleAddEmail} className='admin-button'>Agregar Email</button>
            <div style={{ borderBottom: '1px solid #000', margin: '10px 0' }}></div>
        </div>
    );
};

export default Bestfriends;
