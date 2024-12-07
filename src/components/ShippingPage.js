import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoogleMaps from './GoogleMaps'; // Asegúrate de que la ruta sea correcta
import './ShippingPage.css'; // Ajusta la ruta si es necesario
//import { config } from './config';

const ShippingPage = ({ config }) => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [emailInput, setEmailInput] = useState(email || '');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [mobileNumber, setMobileNumber] = useState('');
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [fullAddress, setFullAddress] = useState('');
  const [shippingOption, setShippingOption] = useState('normal');
  const [shippingCost, setShippingCost] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountStatus, setDiscountStatus] = useState('default'); // Estado para el código de descuento
  const [pais, setPais] = useState('ESP');
  const apiUrl = config.apiUrl;




  useEffect(() => {
    fetch(`${apiUrl}/api/carts/email/${email}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {

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

  const handlePaisChange = (e) => {
    setPais(e.target.value);
    setShippingCost(getShippingCost(shippingOption, e.target.value));

  };

  const handleShippingOptionChange = (option) => {
    setShippingOption(option);
    setShippingCost(getShippingCost(option, pais)); // Actualiza el costo de envío basado en la opción y país seleccionados
  };


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


  //ESTO LO HE HECHO YO :)
  const getShippingCost = (shippingType = shippingOption) => {
    if (itemsTotal >= (config.envioGratis ? config.envioGratis : 999999) && pais === 'ESP') {
      return 0;
    }

    // Lógica para calcular el costo de envío según el país y la opción seleccionada
    if (pais === 'ESP') {
      return shippingType === 'normal' ? 3.99 : 10.99;
    } else if (pais === 'ESP1') {
      return shippingType === 'normal' ? 25.90 : 59.30;
    } else if (pais === 'EUR') {
      return shippingType === 'normal' ? 25.90 : 59.30;
    } else if (pais === 'UK') {
      return shippingType === 'normal' ? 27.40 : 65.30;
    } else if (pais === 'AUS') {
      return shippingType === 'normal' ? 122.73 : 208.78;
    } else if (pais === 'AR') {
      return shippingType === 'normal' ? 105.35 : 215.51;
    } else {
      return 12.99; // Costo por defecto si no coincide ningún país
    }
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
    const checkoutUrl = `${apiUrl}/api/checkout/create-checkout-session?cartEmail=${email}&shippingCost=${shippingCost}&mobileNumber=${mobileNumber}&fullAddress=${formattedAddress}&typeShipping=${shippingOption}&discountName=${discountCode}`;
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
    fetch(`${apiUrl}/api/discounts/nombre/${discountCode}`)
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
      <div className='pais-selector input-admin' >
        <select
          value={pais}
          onChange={handlePaisChange}
          className="mobile-input"
        >
          <option value="ESP">España (peninsula)</option>
          <option value="ESP1">España (Baleares y Canarias)</option>
          <option value="EUR">Europa</option>
          <option value="UK">Reino Unido e Irlanda</option>
          <option value="AUS">Australia</option>
          <option value="AR">Argentina</option>
        </select>
      </div>

      <GoogleMaps
        onLocationChange={(position) => console.log('Location changed:', position)}
        onAddressChange={setFullAddress}
      />

      


      <div className="shipping-options">
        <h3>Opciones de Envío:</h3>

        {(itemsTotal >= (config.envioGratis ? config.envioGratis : 999999) && pais === 'ESP') ? (
          <p>Envío gratis</p>
        ) : (
          <div>
            <label>
              <input
                type="radio"
                name="shipping"
                value="normal"
                checked={shippingOption === 'normal'}
                onChange={(e) => handleShippingOptionChange('normal')}
              />
              Normal ({getShippingCost('normal').toFixed(2)} EUR, 5-7 días)
            </label>
            <label>
              <input
                type="radio"
                name="shipping"
                value="priority"
                checked={shippingOption === 'priority'}
                onChange={(e) => handleShippingOptionChange('priority')}
              />
              Prioritario ({getShippingCost('priority').toFixed(2)} EUR, 1-2 días)
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
          Envío: {(itemsTotal >= (config.envioGratis ? config.envioGratis : 999999) && pais === 'ESP') ? 'Gratis' : `${getShippingCost().toFixed(2)} EUR`}
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
        <div style={{display : 'flex'}}>
          <input style={{width:'100%'}}
            type="text"
            placeholder="Nombre"
            className="mobile-input"

          />

          <input style={{width:'100%'}}
            type="text"
            placeholder="Apellidos"
            className="mobile-input"

          />
        </div>

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
