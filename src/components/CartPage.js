import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa'; // Importa los íconos necesarios
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
////import { config } from './config';
import './CartPage.css';

const CartPage = ({config}) => {
  const [cart, setCart] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true); // Nuevo estado para la validez del email
  const navigate = useNavigate(); // Inicializa useNavigate
  const apiUrl = config.apiUrl;

  useEffect(() => {
    const userEmail = getCookie('userEmail');
    if (userEmail) {
      let oldUserMail = decodeEmail(userEmail);
      console.log("Correo: " + oldUserMail);
      setEmailInput(oldUserMail);
      fetchCartItems(oldUserMail);
    } else {
      const storedCart = sessionStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
        console.log('Carrito cargado desde sessionStorage');
      } else {
        const localStorageCart = localStorage.getItem('cart');
        if (localStorageCart) {
          setCart(JSON.parse(localStorageCart));
          console.log('Carrito cargado desde localStorage');
        } else {
          setError('No hay productos en el carrito. Introduce tu email para buscar carritos antiguos.');
        }
      }
    }
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
  };

  const decodeEmail = (encodedString) => {
    return decodeURIComponent(encodedString)
      .split('%40').join('@')
      .split('%2540').join('@');
  };

  const fetchCartItems = (email) => {
    const encodedEmail = encodeURIComponent(email);
    console.log('Encoded Email for fetch:', encodedEmail);

    fetch(`${apiUrl}/api/carts/email/${encodedEmail}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error al obtener los elementos del carrito.');
        }
      })
      .then(data => {
        if (data && data.cartItems) {
          setCart(data.cartItems || []);
        } else {
          setError('No se encontraron elementos en el carrito.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Hubo un problema al obtener los elementos del carrito.');
      });
  };

  const handleEmailSubmit = () => {
    const email = emailInput;
    if (email) {
      if (!isEmailValid) {
        console.error('Email no válido.');
        return;
      }

      if (!getCookie('userEmail')) {
        const encodedEmail = encodeURIComponent(email);
        console.log(`Intentando eliminar el carrito existente para el email: ${encodedEmail}`);

        fetch(`${apiUrl}/api/carts/email/${encodedEmail}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al eliminar el carrito anterior.');
            }
            console.log('Carrito eliminado exitosamente');

            document.cookie = `userEmail=${encodeURIComponent(email)}; path=/`;
            const totalPrice = calculateTotalPrice();
            const cartData = {
              userEmail: email,
              totalPrice: parseFloat(totalPrice),
              cartItems: cart.map(item => ({
                product: { id: item.product.id },
                color: item.color || 'Normal',
                size: item.size || 'Normal',
                quantity: item.quantity
              }))
            };

            console.log('Enviando datos del carrito:', JSON.stringify(cartData));

            return fetch(`${apiUrl}/api/carts`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cartData)
            });
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al subir el carrito al servidor.');
            }
            console.log('Carrito subido exitosamente');
            return response.json();
          })
          .then(data => {
            if (data) {
              setCart(data.cartItems);
              navigate(`/envio/${emailInput}`);
            } else {
              setError('Hubo un problema al subir el carrito.');
            }
          })
          .catch(error => {
            console.error('Error al procesar la solicitud:', error);
            setError('Hubo un problema al procesar la solicitud.');
          });
      } else {
        console.log('Carrito ya existente, actualizando estado');
        fetchCartItems(email);
        navigate(`/envio/${emailInput}`);
      }
    } else {
      console.error('No se ha proporcionado un email.');
    }
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = cart[index];
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);

    const userEmail = getCookie('userEmail');
    if (userEmail) {
      const encodedEmail = decodeEmail(userEmail);
      fetch(`${apiUrl}/api/carts/email/${encodedEmail}/items/${itemToRemove.id}`, {
        method: 'DELETE'
      })
        .catch(error => console.error('Error al eliminar el producto del carrito:', error));
    } else {
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };


  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmailInput(email);
    if (email && !validateEmail(email)) {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(true);
    }
  };

  const handleClearEmail = () => {
    deleteCookie('userEmail');
    setEmailInput('');
    setIsEmailValid(true); // Reiniciar la validez del email
  };

  if (error) return <p className="error-message">{error}</p>;

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <FaShoppingCart className="empty-cart-icon" />
        <p className="empty-cart-message">Tu carrito está vacío.</p>
        <p className="empty-cart-suggestion">Explora nuestros productos y llena tu carrito con artículos increíbles.</p>
        <a href="/" className="empty-cart-button">Ir a la tienda</a>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Tu Carrito</h1>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            {item.product.images && item.product.images.length > 0 ? (
              <img
                src={`${apiUrl}${item.product.images[0]}`} // Cambia aquí para usar la URL de tu servidor
                alt={item.product.name}
                className="cart-item-image"
              />
            ) : (
              <div className="cart-item-placeholder">No image available</div>
            )}

            <div className="cart-item-details">
              <div className="cart-item-header">
                <h2>{item.product.name}</h2>
              </div>
              <p>Tamaño: {item.size || 'Normal'}</p>
              <p>Cantidad: {item.quantity}</p>
              <div className='cart-item-details-price-delete'>
                <p>{item.product.price.toFixed(2)} EUR</p>
                <FaTrashAlt className="remove-item-icon" onClick={() => handleRemoveItem(index)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total: {calculateTotalPrice()} EUR</h2>
      </div>
      <div className="checkout-section">
        <div className='input-trash'>
          <input
            type="email"
            value={emailInput}
            onChange={handleEmailChange}
            placeholder="Tu email"
            className={`email-input ${!isEmailValid && !getCookie('userEmail') ? 'invalid' : ''}`}
            readOnly={!!getCookie('userEmail')}
          />
          <FaTrashAlt className="remove-item-icon" onClick={handleClearEmail} />
        </div>
        <button
          className="checkout-button"
          onClick={handleEmailSubmit}
          disabled={!emailInput.trim() || !isEmailValid}
        >
          Continuar con envio
        </button>
      </div>
    </div>
  );

};

export default CartPage;




