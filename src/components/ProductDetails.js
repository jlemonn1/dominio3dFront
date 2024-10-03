import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ProductDetails.css';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';
import { config } from './config';

const ProductDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  // Set default product structure
  const [product, setProduct] = useState({
    images: [], // Assuming 'images' holds base64-encoded image strings
    size: '',
    color: '',
    category: '',
    name: '',
    price: 0,
    description: '',
  });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showSizeOptions, setShowSizeOptions] = useState(false);
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [hasAttemptedAddToCart, setHasAttemptedAddToCart] = useState(false);
  const apiUrl = config.apiUrl;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // Fetch product details based on the ID from URL
    fetch(`${apiUrl}/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Error fetching product details:', error));
  }, [id]);

  useEffect(() => {
    if (product) {
      // Fetch related products, excluding the current one
      fetch(`${apiUrl}/api/products`)
        .then((response) => response.json())
        .then((products) => {
          const filteredProducts = products.filter((p) => p.id !== id);
          setRelatedProducts(filteredProducts);
        })
        .catch((error) => console.error('Error fetching all products:', error));
    }
  }, [product, id]);

  const processOptions = (options) => {
    // Process options such as size and color
    return options.split(',').map((option) => {
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

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const isAddToCartDisabled = () => {
    // Disable add to cart if size or color isn't selected when they are available
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
    // Handle adding the product to the cart
    if (isAddToCartDisabled()) {
      setHasAttemptedAddToCart(true);
      return;
    } else {
      setHasAttemptedAddToCart(false);
      const email = getCookie('userEmail');
      const cartItem = {
        product: { id: product.id, name: product.name, price: product.price, images: product.images },
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      };

      if (email) {
        // Post cart item to the user's cart on the server
        fetch(`${apiUrl}/api/carts/email/${email}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItem),
        })
          .then((response) => {
            if (response.ok) {
              toast.success('Producto añadido al carrito exitosamente.');
            } else {
              throw new Error('Error al añadir el producto al carrito.');
            }
          })
          .catch((error) => {
            console.error('Error:', error);
            toast.error('Hubo un problema al añadir el producto al carrito.');
          });
      } else {
        // Handle adding to cart via local storage if no user is logged in
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
        <div className="product-carousel" >
          <Carousel>
            {product.images && product.images.length > 0 ? (
              product.images.map((imageUrl, index) => (
                <div key={index}>
                  <img
                    src={imageUrl} // Usa la URL directamente
                    alt={`${product.name} - ${index + 1}`}
                  />
                </div>
              ))
            ) : (
              <div>No images available</div>
            )}
          </Carousel>
        </div>



        <div className="product-info">
          <p className="category">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="price">{product.price} EUR</p>
          <p className="description">{formatDescription(product.description)}</p>

          {sizes.length > 0 && (
            <div
              className={`selector ${!selectedSize && sizes.length > 0 && hasAttemptedAddToCart ? 'error' : ''
                }`}
            >
              <div className="selector-button" onClick={() => setShowSizeOptions((prev) => !prev)}>
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
            <div
              className={`selector ${!selectedColor && colors.length > 0 && hasAttemptedAddToCart ? 'error' : ''
                }`}
            >
              <div className="selector-button" onClick={() => setShowColorOptions((prev) => !prev)}>
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
            <button className="buy-now" onClick={handleBuyNow} disabled={isAddToCartDisabled()}>
              Comprar ahora
            </button>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>Productos Relacionados</h2>
        <div className="related-products-container">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              title={relatedProduct.name}
              price={relatedProduct.price}
              image={
                relatedProduct.images && relatedProduct.images.length > 0
                  ? `${relatedProduct.images[0]}` // Usar la URL de la imagen almacenada
                  : '' // Si no hay imagen, dejar vacío
              }
              onClick={() => handleProductClick(relatedProduct.id)}
            />
          ))}
        </div>


      </div>
    </div>
  );
};

export default ProductDetails;
