import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoogleMaps from './GoogleMaps'; // Asegúrate de que la ruta sea correcta
import './ShippingPage.css'; // Ajusta la ruta si es necesario

const ShippingPage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [emailInput, setEmailInput] = useState(email || '');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [shippingOption, setShippingOption] = useState('normal');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountStatus, setDiscountStatus] = useState('default'); // Estado para el código de descuento

  useEffect(() => {
    fetch(`http://localhost:8080/api/carts/email/${email}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('API response:', data);

        if (data && data.cartItems && Array.isArray(data.cartItems) && data.cartItems.length > 0) {
          setCart(data.cartItems);
        } else {
          console.error('Unexpected or empty structure in API response:', data);
          navigate('/'); // Redirige a la página principal si no hay carrito válido
        }
      })
      .catch(error => {
        console.error('Error loading cart:', error);
        navigate('/'); // Redirige a la página principal si ocurre un error
      });
  }, [email, navigate]);

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
    setIsEmailValid(e.target.value.includes('@'));
  };

  const handleMobileChange = (e) => {
    const number = e.target.value;
    setMobileNumber(number);

    const phoneRegex = /^[0-9]{7,15}$/;
    setIsMobileValid(phoneRegex.test(number));
  };

  const calculateItemsTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  const itemsTotal = parseFloat(calculateItemsTotal());

  const getShippingCost = () => {
    if (itemsTotal > 50) {
      return 0;
    }
    return shippingOption === 'normal' ? 3.99 : 10.99;
  };

  const calculateDiscount = () => {
    return (itemsTotal * discountPercentage) / 100;
  };

  const totalPrice = (itemsTotal - calculateDiscount() + getShippingCost()).toFixed(2);

  const handlePayment = () => {
    if (!isEmailValid || !isMobileValid || !fullAddress.trim()) {
      return;
    }
    const formattedAddress = fullAddress
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/\//g, '-');
    const shippingCost = getShippingCost();
    const checkoutUrl = `http://localhost:8080/api/checkout/create-checkout-session?cartEmail=${email}&shippingCost=${shippingCost}&mobileNumber=${mobileNumber}&fullAddress=${formattedAddress}&typeShipping=${shippingOption}&discountName=${discountCode}`;
    console.log('Checkout URL:', checkoutUrl);

    fetch(checkoutUrl)
      .then(response => response.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url;
        } else {
          console.error('Stripe URL no encontrada');
        }
      })
      .catch(error => console.error('Error creando la sesión de pago:', error));
  };

  const handleDiscountCodeChange = (e) => {
    setDiscountCode(e.target.value);
    setDiscountStatus('default'); // Resetear el estado del descuento cuando el código cambia
  };

  const applyDiscount = () => {
    fetch(`http://localhost:8080/api/discounts/nombre/${discountCode}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Discount not found');
        }
        return response.json();
      })
      .then(data => {
        // Check if the discount has a valid percentage and numVidas is >= 1
        if (data.porcentaje && data.numVidas >= 1) {
          setDiscountPercentage(data.porcentaje);
          setDiscountStatus('valid'); // Código válido
          console.log('Discount applied:', data.porcentaje);
        } else {
          setDiscountPercentage(0); // Restablece el porcentaje de descuento
          setDiscountStatus('not-found'); // Código no encontrado o sin vidas
          console.warn('Discount not applicable, insufficient lives');
        }
      })
      .catch(error => {
        console.error('Error applying discount:', error);
        setDiscountPercentage(0); // Restablece el porcentaje de descuento si hay un error
        setDiscountStatus('not-found'); // Código no encontrado
      });
  };


  return (
    <div className="shipping-page">
      <h1>Dirección de Envío</h1>
      <GoogleMaps
        onLocationChange={(position) => console.log('Location changed:', position)}
        onAddressChange={setFullAddress}
      />

      <div className="shipping-options">
        <h3>Opciones de Envío:</h3>
        {itemsTotal > 50 ? (
          <p>Envío gratis</p>
        ) : (
          <div>
            <label>
              <input
                type="radio"
                name="shipping"
                value="normal"
                checked={shippingOption === 'normal'}
                onChange={(e) => setShippingOption(e.target.value)}
              />
              Normal (3,99 EUR, 5-7 días)
            </label>
            <label>
              <input
                type="radio"
                name="shipping"
                value="priority"
                checked={shippingOption === 'priority'}
                onChange={(e) => setShippingOption(e.target.value)}
              />
              Prioritario (10,99 EUR, 1-2 días)
            </label>
          </div>
        )}
      </div>

      <div className="discount-section">
        <h3>Código de Descuento:</h3>
        <div className="discount-section-button-input">
          <input
            type="text"
            className={`discount-input ${discountStatus}`}
            value={discountCode}
            onChange={handleDiscountCodeChange}
            placeholder="Ingresa tu código de descuento"
          />
          <button
            className="discount-button"
            onClick={applyDiscount}
          >
            Aplicar
          </button>
        </div>
      </div>

      <div className="cart-summary">
        <h3>Desglose del Precio:</h3>
        <p>Pedido: {itemsTotal.toFixed(2)} EUR</p>
        {/* Conditionally render the discount paragraph only if a discount is applied */}
        {discountPercentage > 0 && (
          <p>Descuento: {calculateDiscount().toFixed(2)} EUR ({discountPercentage}%)</p>
        )}

        <p>
          Envío: {itemsTotal > 50 ? 'Gratis' : `${getShippingCost().toFixed(2)} EUR`}
        </p>
        <h4>Total: {totalPrice} EUR</h4>
      </div>

      <div className="checkout-section">
        <input
          type="email"
          value={emailInput}
          onChange={handleEmailChange}
          placeholder="Tu email"
          className={`email-input ${!isEmailValid ? 'invalid' : ''}`}
          readOnly
        />

        <input
          type="tel"
          value={mobileNumber}
          onChange={handleMobileChange}
          placeholder="Tu número móvil"
          className={`mobile-input ${!isMobileValid && mobileNumber ? 'invalid' : ''}`}
        />

        <button
          className="checkout-button"
          onClick={handlePayment}
          disabled={
            !emailInput.trim() ||
            !isEmailValid ||
            !isMobileValid ||
            !fullAddress.trim()
          }
        >
          Ir al pago
        </button>
      </div>
    </div>
  );
};

export default ShippingPage;
