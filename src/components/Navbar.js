import React, { useState, useEffect } from 'react'; // Agrega useEffect aquí
import {
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Form,
  FormControl,
} from 'react-bootstrap';
import {
  FaSearch,
  FaShoppingCart,
  FaBars,
  FaInstagram,
  FaEnvelope,
  FaTiktok,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Agrega useNavigate aquí
import logo from './img/logo.png';
import './Navbar.css';
import { config } from './config';

const MyNavbar = () => {
  const [show, setShow] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Estado para categorías
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  // Fetch para obtener productos y extraer categorías únicas
  useEffect(() => {
    fetch(`${apiUrl}/api/products`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const uniqueCategories = [...new Set(data.map(product => product.category))]; // Filtra categorías únicas
        setCategories(uniqueCategories);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  // Redirigir a la página de categoría
  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    handleClose(); // Cierra el menú offcanvas si está abierto
  };

  return (
    <>
      <Navbar expand="lg" className="d-flex justify-content-between">
        {/* Botón del menú en pantallas pequeñas */}
        <div className="d-lg-none ms-2">
          <Button onClick={handleShow} className="button">
            <FaBars />
          </Button>
        </div>

        {/* Logo */}
        <Navbar.Brand href="/" className="mx-auto mx-lg-0">
          <img src={logo} alt="Logo" height="40" className="p-1 ps-4" />
        </Navbar.Brand>

        {/* Iconos de búsqueda y carrito en pantallas pequeñas */}
        <div className="d-lg-none d-flex align-items-center pe-2">
          <Button onClick={toggleSearch} className="button">
            <FaSearch className="mx-2" />
          </Button>
          <Nav.Link href="/cart">
            <FaShoppingCart className="mx-2 fa" />
          </Nav.Link>
        </div>

        {/* Navegación en pantallas grandes */}
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="d-none d-lg-flex justify-content-center ps-2"
        >
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {categories.map((category, index) => (
              <Nav.Link key={`${category}-${index}`} onClick={() => handleCategoryClick(category)}>
                {category}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>

        {/* Iconos de búsqueda y carrito en pantallas grandes */}
        <div className="d-none d-lg-flex align-items-center pe-2">
          <Button onClick={toggleSearch} className="button">
            <FaSearch className="mx-2 fa" />
          </Button>
          <Nav.Link href="/cart">
            <FaShoppingCart className="mx-2 fa" />
          </Nav.Link>
        </div>
      </Navbar>

      {/* Barra de búsqueda */}
      <div className={`search-bar ${searchOpen ? 'search-bar-open' : ''}`}>
        <Form className="d-flex">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success" type="submit">
            Search
          </Button>
        </Form>
      </div>

      {/* Menú Offcanvas para pantallas pequeñas */}
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {categories.map((category, index) => (
              <Nav.Link key={`${category}-${index}`} onClick={() => handleCategoryClick(category)}>
                {category}
              </Nav.Link>
            ))}
          </Nav>
          <div className="offcanvas-social mt-auto">
            <div className="d-flex justify-content-center">
              <a href={`mailto:${config.correo}`} className="social-icon">
                <FaEnvelope />
              </a>
              {config.tiktok ? <a href={`https://www.tiktok.com/@${config.tiktol}?_t=8pxVIfRQge8&_r=1`} className="social-icon"><FaTiktok /></a> : '' }
              {config.instagram ? <a href={ `https://www.instagram.com/${config.instagram}`} className="social-icon"><FaInstagram /></a> : '' }
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyNavbar;
