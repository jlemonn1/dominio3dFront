import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductDetails.css';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [hasAttemptedAddToCart, setHasAttemptedAddToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [id]);

  useEffect(() => {
    if (product) {
      fetch('http://localhost:8080/api/products')
        .then(response => response.json())
        .then(products => {
          const filteredProducts = products.filter(p => p.id !== id);
          setRelatedProducts(filteredProducts);
        })
        .catch(error => console.error('Error fetching all products:', error));
    }
  }, [product, id]);

  if (!product) return <p>Loading...</p>;

  const processOptions = (options) => {
    return options.split(',').map(option => {
      const trimmedOption = option.trim();
      const isNotAvailable = trimmedOption.startsWith('-');
      const displayOption = isNotAvailable ? trimmedOption.substring(1).trim() : trimmedOption;
      return { isNotAvailable, displayOption };
    });
  };

  const sizes = product.size && product.size !== 'NOSIZE' ? processOptions(product.size) : [];
  const colors = product.color && product.color !== 'NOCOLOR' ? processOptions(product.color) : [];

  const formatDescription = (description) => {
    if (typeof description !== 'string') return '';
    return description.split('\n').map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    ));
  };

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const isAddToCartDisabled = () => {
    return (sizes.length > 0 && !selectedSize) || (colors.length > 0 && !selectedColor);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleAddToCart = () => {
    if (isAddToCartDisabled()) {
      setHasAttemptedAddToCart(true);
      return;
    } else {
      setHasAttemptedAddToCart(false);
      const email = getCookie('userEmail');
      const cartItem = {
        product: { id: product.id, name: product.name, price: product.price, urlImg: product.urlImg },
        color: selectedColor,
        size: selectedSize,
        quantity: quantity
      };

      if (email) {
        fetch(`http://localhost:8080/api/carts/email/${email}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cartItem)
        })
          .then(response => {
            if (response.ok) {
              toast.error('Producto añadido al carrito exitosamente.');
            } else {
              throw new Error('Error al añadir el producto al carrito.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            toast.error('Hubo un problema al añadir el producto al carrito.');
          });
      } else {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        toast.success('Producto añadido al carrito exitosamente.');
      }
    }
  };

  const handleBuyNow = () => {
    if (isAddToCartDisabled()) return;

    handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="product-details">
      <div className="product-main-content">
        <div className="product-carousel">
          <Carousel>
            {product.urlImg.map((img, index) => (
              <div key={index}>
                <img src={img} alt={`${product.name} - ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        </div>

        <div className="product-info">
          <p className="category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="price">{product.price} EUR</p>
          <p className="description">{formatDescription(product.description)}</p>

          {sizes.length > 0 && (
            <div className={`selector ${(!selectedSize && sizes.length > 0 && hasAttemptedAddToCart) ? 'error' : ''}`}>
              <div
                className="selector-button"
                onClick={() => setShowSizeOptions(prev => !prev)}
              >
                Tamaño: {selectedSize || 'Selecciona tamaño'}
                <span>{showSizeOptions ? '▲' : '▼'}</span>
              </div>
              <div className={`selector-options ${showSizeOptions ? 'active' : ''}`}>
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className={`selector-option ${size.isNotAvailable ? 'not-available' : ''}`}
                    onClick={() => {
                      if (!size.isNotAvailable) {
                        setSelectedSize(size.displayOption);
                        setShowSizeOptions(false);
                      }
                    }}
                  >
                    {size.displayOption}
                  </div>
                ))}
              </div>
            </div>
          )}

          {colors.length > 0 && (
            <div className={`selector ${(!selectedColor && colors.length > 0 && hasAttemptedAddToCart) ? 'error' : ''}`}>
              <div
                className="selector-button"
                onClick={() => setShowColorOptions(prev => !prev)}
              >
                Color: {selectedColor || 'Selecciona color'}
                <span>{showColorOptions ? '▲' : '▼'}</span>
              </div>
              <div className={`selector-options ${showColorOptions ? 'active' : ''}`}>
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`selector-option ${color.isNotAvailable ? 'not-available' : ''}`}
                    onClick={() => {
                      if (!color.isNotAvailable) {
                        setSelectedColor(color.displayOption);
                        setShowColorOptions(false);
                      }
                    }}
                  >
                    {color.displayOption}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="quantity-selector">
            <button onClick={handleDecrement}>-</button>
            <span>{quantity}</span>
            <button onClick={handleIncrement}>+</button>
          </div>

          <div className="action-buttons">
            <button
              className="add-to-cart"
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled()}
            >
              Añadir al carrito
            </button>
            <button
              className="buy-now"
              onClick={handleBuyNow}
              disabled={isAddToCartDisabled()}
            >
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>Productos Relacionados</h2>
        <div className="related-products-container">
          {relatedProducts.map(product => (
            <ProductCard
              key={product.id}
              title={product.name}
              price={product.price}
              image={product.urlImg[0]}
              onClick={() => handleProductClick(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
