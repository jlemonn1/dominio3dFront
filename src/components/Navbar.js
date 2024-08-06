import React, { useState } from 'react';
import { Navbar, Nav, Button, Offcanvas, Form, FormControl } from 'react-bootstrap';
import { FaSearch, FaShoppingCart, FaBars, FaInstagram, FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import logo from './img/logo.png'; 
import './Navbar.css';

const MyNavbar = () => {
  const [show, setShow] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="d-flex justify-content-between">
        <div className="d-lg-none ms-2">
          <Button variant="dark" onClick={handleShow}>
            <FaBars />
          </Button>
        </div>
        <Navbar.Brand href="/" className="mx-auto mx-lg-0">
          <img src={logo} alt="Logo" height="40" className='p-1 ps-4'/>
        </Navbar.Brand>
        <div className="d-lg-none d-flex align-items-center pe-2">
          <Button variant="dark" onClick={toggleSearch}>
            <FaSearch className="text-white mx-2" />
          </Button>
          <Nav.Link href="/cart" className="text-white"><FaShoppingCart className="text-white mx-2" /></Nav.Link>
        </div>
        <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex justify-content-center ps-2">
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/hogar" className="text-white">Hogar</Nav.Link>
            <Nav.Link href="/herramientas" className="text-white">Herramientas</Nav.Link>
            <Nav.Link href="/ninos" className="text-white">Niños</Nav.Link>
            <Nav.Link href="/friki" className="text-white">Friki</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className="d-none d-lg-flex align-items-center pe-2">
          <Button variant="dark" onClick={toggleSearch}>
            <FaSearch className="text-white mx-2" />
          </Button>
          <Nav.Link href="/cart" className="text-white"><FaShoppingCart className="text-white mx-2" /></Nav.Link>
        </div>
      </Navbar>

      <div className={`search-bar ${searchOpen ? 'search-bar-open' : ''}`}>
        <Form  className="d-flex">
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success" type="submit">Search</Button>
        </Form>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="bg-dark text-white">
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link href="/" className="text-white">Home</Nav.Link>
            <Nav.Link href="/hogar" className="text-white">Hogar</Nav.Link>
            <Nav.Link href="/herramientas" className="text-white">Herramientas</Nav.Link>
            <Nav.Link href="/ninos" className="text-white">Niños</Nav.Link>
            <Nav.Link href="/friki" className="text-white">Friki</Nav.Link>
          </Nav>
          <div className="offcanvas-social mt-auto">
            <div className="d-flex justify-content-center">
              <FaWhatsapp className="social-icon" />
              <FaPhoneAlt className="social-icon" />
              <FaInstagram className="social-icon" />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyNavbar;
