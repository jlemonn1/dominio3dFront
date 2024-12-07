import React, { useState, useEffect } from 'react';
import {
  Navbar,
  Nav,
  Button,
  Offcanvas,
  Form,
  FormControl,
} from 'react-bootstrap';
import {
  FaUserFriends,
  FaShoppingCart,
  FaBars,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.png';
import './Navbar.css';
import Footer from './Footer';
import { FaEnvelope, FaTiktok, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const MyNavbar = ({ config }) => {
  const [show, setShow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const apiUrl = config.apiUrl;

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/category`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [apiUrl]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
    handleClose();
  };

  const handleFriendsClose = () => setShowFriends(false);
  const handleFriendsShow = () => setShowFriends(true);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${config.apiUrl}/api/best-friends/login?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('No eres de nuestro club :(\nCompra un producto y accede');
      }

      const token = await response.text();
      localStorage.setItem('token', token);

      if (token) {
        setShowFriends(false);
        navigate('/best');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Agrupar categorías por nombre
  const groupCategories = () => {
    return categories.reduce((acc, { id, category, subCategory }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ id, subCategory });
      return acc;
    }, {});
  };

  const groupedCategories = groupCategories();

  return (
    <>
      <Navbar expand="lg" className="d-flex justify-content-between">
        <div className="d-lg-none ms-2">
          <Button onClick={handleShow} className="button">
            <FaBars />
          </Button>
        </div>

        <Navbar.Brand href="/" className="mx-auto mx-lg-0">
          <img src={logo} alt="Logo" height="40" className="p-1 ps-4" />
        </Navbar.Brand>

        <div className="d-lg-none d-flex align-items-center pe-2">
          <Button onClick={handleFriendsShow} className="button">
            <FaUserFriends className="mx-2" />
          </Button>
          <Nav.Link href="/cart">
            <FaShoppingCart className="mx-2 fa" />
          </Nav.Link>
        </div>

        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex justify-content-center ps-2">
          <Nav className="mr-auto">
            <Nav.Link href="/">HOME</Nav.Link>
            <Nav.Link href="/about" style={{ marginLeft: '30px' }}>
              ABOUT US
            </Nav.Link>
            <Nav.Link href="/restock" style={{ marginTop: '0px' }}>
              DEVOLUCIONES
            </Nav.Link>
            <Nav.Link href="/locker" style={{ marginTop: '0px' }}>
              LOCKER
            </Nav.Link>
            <Nav.Link href="/collections" style={{ marginTop: '0px' }}>
              COLLECTIONS
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-none d-lg-flex align-items-center pe-2">
          <Button onClick={handleFriendsShow} className="button">
            <FaUserFriends className="mx-2 fa" />
          </Button>
          <Nav.Link href="/cart">
            <FaShoppingCart className="mx-2 fa" />
          </Nav.Link>
        </div>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton style={{ paddingLeft: '0px' }}>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav.Link href="/locker" >
            LOCKER
          </Nav.Link>
          <Nav.Link href="/collections" style={{ marginTop: '10px', marginBottom: '10px' }}>
            COLLECTIONS
          </Nav.Link>
          <div style={{ width: '100%', height: '2px', backgroundColor: '#010101' }}></div>
          <Nav className="flex-column">
            {Object.keys(groupedCategories).map((category) => {
              const categoryData = groupedCategories[category]; // Obtener datos de categoría
              return (
                <div key={category}>
                  <Nav.Link onClick={() => handleCategoryClick(category)} style={{ cursor: 'pointer' }}>
                    {category}
                  </Nav.Link>
                  {Array.isArray(categoryData) && categoryData.length > 0 ? (
                    <ul>
                      {categoryData
                        .filter(({ subCategory }) => subCategory !== "") // Filtra las subcategorías vacías
                        .map(({ id, subCategory }) => (
                          <li key={id} style={{ listStyleType: 'none' }}>
                            <Nav.Link onClick={() => handleCategoryClick(subCategory)} style={{ marginLeft: '10px' }}>
                              {subCategory}
                            </Nav.Link>
                          </li>
                        ))}
                    </ul>
                  ) : null /* No se muestra nada si no hay subcategorías */}
                </div>
              );
            })}


            <div style={{ width: '100%', height: '2px', backgroundColor: '#010101' }}></div>
            <Nav.Link href="/about" style={{ marginTop: '10px' }}>
              ABOUT US
            </Nav.Link>
            <Nav.Link href="/restock" style={{ marginTop: '0px' }}>
              DEVOLUCIONES
            </Nav.Link>
            <div className="offcanvas-social mt-auto">
              <div className="d-flex justify-content-center">
                <a href={`mailto:${config.correo}`} className="social-icon">
                  <FaEnvelope />
                </a>
                {config.tiktok ? <a href={`https://www.tiktok.com/@${config.tiktok}`} className="social-icon"><FaTiktok /></a> : ''}
                {config.instagram ? <a href={`https://www.instagram.com/${config.instagram}`} className="social-icon"><FaInstagram /></a> : ''}
                {config.whatsapp ? <a href={`https://wa.me/34${config.whatsapp}`} className="social-icon"><FaWhatsapp /></a> : ''}
              </div>
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showFriends} onHide={handleFriendsClose} placement="end" className="offcanvas-friends">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>FRIENDS & FAMILY</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <p>Bienvenido a la sección de FRIENDS & FAMILY. Por favor, verifica tu correo electrónico para continuar.</p>
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <FormControl
                type="email"
                placeholder="Ingresa tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            {error && (
              <div className="error-message">
                {error.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            <Button type="submit" variant="primary" className="mt-3">
              Verificar
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer config={config} />
    </>
  );
};

export default MyNavbar;
