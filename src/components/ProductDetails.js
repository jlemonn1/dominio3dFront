import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css'; // Importa el CSS de slick-carousel
import 'slick-carousel/slick/slick-theme.css'; // Importa el tema de slick-carousel
import Slider from 'react-slick'; // Importa react-slick
import { useParams, useNavigate } from 'react-router-dom';
import VariantButtons from './VariantButtons';


import './ProductDetails.css';
import ProductCard from './ProductCard';
import { toast } from 'react-toastify';

import Modal from 'react-modal';
import Select from 'react-select';



import { FaSearchPlus } from 'react-icons/fa'; // Ícono de lupa

Modal.setAppElement('#root');

const ProductDetails = ({ config }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);


  const [product, setProduct] = useState({
    images: [],
    size: '',
    color: '',
    category: '',
    name: '',
    price: 0,
    description: '',
  });


  const apiUrl = config.apiUrl;
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [hasAttemptedAddToCart, setHasAttemptedAddToCart] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const [isZoomOpen, setIsZoomOpen] = useState(false); // Estado para abrir/cerrar el modal
  const [currentImage, setCurrentImage] = useState(null); // Imagen seleccionada

  const [isAddToCartDisabled, setIsAddToCartDisabled] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");

  const [uniqueSize, setUniqueSize] = useState({});

  const openZoomModal = (imageUrl) => {
    setCurrentImage(imageUrl);
    setIsZoomOpen(true);
    document.body.style.overflow = 'hidden'; // Evitar el scroll en el fondo
  };

  const closeZoomModal = () => {
    setIsZoomOpen(false);
    document.body.style.overflow = 'auto'; // Restaurar el scroll
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);




  useEffect(() => {
    fetch(`${apiUrl}/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);

        // Crear el HashMap de variantes
        const sizeStockMap = data.variants.reduce((map, variant) => {
          map[variant.size] = variant.stock; // Clave: size, Valor: stock
          return map;
        }, {});

        console.log('HashMap de tamaño-stock:', sizeStockMap);

        // Si necesitas usarlo en el estado:
        setUniqueSize(sizeStockMap);
      })
      .catch((error) => console.error('Error fetching product details:', error));
  }, [id, apiUrl]);




  useEffect(() => {
    if (product.catId) { // Asegurarse de que el producto ya está cargado
      fetch(`${apiUrl}/api/products`)
        .then((response) => response.json())
        .then((data) => {
          const relatedProducts = data.filter((p) => p.catId === product.catId && p.id !== product.id && p.bestFriends === false); // Filtrar productos relacionados y excluir el actual
          setRelatedProducts(relatedProducts);
          console.log('Productos relacionados: ', relatedProducts);
        })
        .catch((error) => console.error('Error fetching related products:', error));
    }
  }, [product, apiUrl]); // Asegurarse de que este efecto depende de `product`

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
  const handleDecrement = () => {
    if (quantity <= 1) {
      toast.warn('No puedes reducir la cantidad por debajo de 1.');
      return;
    }
    setQuantity(prev => prev - 1);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    console.log("Tamaño selec:", size);
    console.log("Stock??", uniqueSize[size]); // Asegúrate de que 'size' sea la clave correcta

    // Comprueba si la talla seleccionada tiene stock disponible
    if (size && uniqueSize[size] > 0) { // Usa 'size' directamente
      setIsAddToCartDisabled(false); // Habilitar botón
      console.log("Habilitar botón");
    } else {
      setIsAddToCartDisabled(true); // Deshabilitar botón
      console.log("Deshabilitar botón");
    }
  };


  const handleAddToCart = async () => {
    if (isAddToCartDisabled) {
      setHasAttemptedAddToCart(true); // Mostrar mensaje de error
      return;
    }
  
    setHasAttemptedAddToCart(false); // Ocultar mensaje de error
    console.log('Agregando producto al carrito...');
  
    const finalSize = selectedSize ? selectedSize : 'Normal';
    const email = getCookie('userEmail');
  
    const cartItem = {
      product: { id: product.id, name: product.name, price: product.price, images: product.images },
      color: product.color,
      size: finalSize,
      quantity: quantity,
    };
    console.log("Producto item:", cartItem);
  
    try {
      if (email) {
        const response = await fetch(`${apiUrl}/api/carts/email/${email}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartItem),
        });
  
        if (response.ok) {
          const toastId = toast.success('Producto añadido al carrito exitosamente.', {
            onClick: () => {
              toast.dismiss(toastId); // Cierra el toast al hacer clic
              navigate('/cart');      // Redirige a /cart
            },
          });
        } else {
          throw new Error('Error al añadir el producto al carrito.');
        }
      } else {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        const toastId = toast.success('Producto añadido al carrito exitosamente.', {
          onClick: () => {
            toast.dismiss(toastId); // Cierra el toast al hacer clic
            navigate('/cart');      // Redirige a /cart
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Hubo un problema al añadir el producto al carrito.');
    }
  };
  


  const handleBuyNow = () => {
    if (isAddToCartDisabled) return;
    handleAddToCart();
    navigate('/cart');
  };





  // Configuración del Slider de react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: autoplay,
    autoplaySpeed: 3000,
    beforeChange: () => setAutoplay(true), // Asegura que el autoplay se reinicie
  };


  return (
    <div className="product-details">
      <div className="product-main-content">
        <div className="product-carousel">
          {product.images && product.images.length > 0 ? (
            product.images.length > 1 ? (
              <Slider {...settings}>
                {product.images.map((imageUrl, index) => (
                  <div key={index}>
                    <img
                      src={`${imageUrl}`}
                      alt={`${product.name} - ${index + 1}`}
                    />
                    <div className="zoom-icon" onClick={() => openZoomModal(`${imageUrl}`)}>
                      <FaSearchPlus size={24} />
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              // Solo una imagen, no usar slider
              <div>
                <img
                  src={`${product.images[0]}`}
                  alt={`${product.name}`}
                />
                <div className="zoom-icon" onClick={() => openZoomModal(`${product.images[0]}`)}>
                  <FaSearchPlus size={24} />
                </div>
              </div>
            )
          ) : (
            <div>No images available</div>
          )}
        </div>

        <Modal
          isOpen={isZoomOpen}
          onRequestClose={closeZoomModal}
          contentLabel="Zoom Modal"
          className={`zoom-modal ${isZoomOpen ? 'show' : ''}`}
          overlayClassName={`zoom-modal-overlay ${isZoomOpen ? 'show' : ''}`}
        >
          <button onClick={closeZoomModal} className="close-modal">
            Cerrar
          </button>
          {currentImage && (
            <div className="zoomed-image-container">
              <img src={currentImage} alt="Zoomed" />
            </div>
          )}
        </Modal>

        {product.locker ? '' : (<div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">{product.price} €</p>
          <div className="product-description">
            <button onClick={() => setIsDescriptionOpen(prev => !prev)}>
              {isDescriptionOpen ? 'Cerrar descripción' : 'Ver descripción'}
            </button>
            {isDescriptionOpen && (
              <div className="description-text">
                <p>{formatDescription(product.description)}</p>
              </div>
            )}
          </div>


          <VariantButtons
            variants={uniqueSize} // Pasa el mapa de tamaño-stock
            onSelectVariant={handleSizeSelect} // Maneja la selección
          />



          {hasAttemptedAddToCart && (
            <p className="error-message">Por favor, selecciona un color y un tamaño disponibles.</p>
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
              disabled={isAddToCartDisabled}
            >
              Añadir al carrito
            </button>
            <button
              className="buy-now"
              onClick={handleBuyNow}
              disabled={isAddToCartDisabled}
            >
              Comprar ahora
            </button>
          </div>
        </div>)}
      </div>

      <div className="related-products">
        <h2>Productos Relacionados</h2>
        <div className="related-products-container">
          {relatedProducts
            .map((relatedProduct) => (
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




