import React, { useState } from 'react';
import { FaEnvelope, FaTiktok, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './AboutUs.css'; // Asegúrate de tener un archivo CSS para los estilos

const AboutUs = ({ config }) => {

  const [formData, setFormData] = useState({
    name: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Crear el enlace mailto
    const mailtoLink = `mailto:${config.correo}?subject=Mensaje de ${formData.name}&body=${encodeURIComponent(formData.message)}`;
    
    // Redirigir al enlace mailto
    window.location.href = mailtoLink;

  };

  return (
    <div className="about-us-container">
      <h1 className="about-us-title">Devoluciones</h1>
      <p className="about-us-description">
       Los productos que adquieres de Annubis Cøllectiøn son únicos y exclusivos por tanto las devoluciones
        y/o cambios de tallas no son posibles, de todas formas si hay algún problema dejamos a vuestra disposición 
        un correo electrónico en el que os podéis poner en contacto con nuestro equipo de atención al cliente, 
        esperamos que entendáis la idea y la exclusividad que tienes al adquirir uno de nuestros productos, gracias  &lt;3.

      </p>

      

      {/* Redes sociales y correo */}
      <div className="d-flex justify-content-center social-icons-container">
        <a href={`mailto:${config.correo}`} className="social-icon" aria-label="Enviar correo">
          <FaEnvelope />
        </a>
        {config.tiktok ? 
          <a href={`https://www.tiktok.com/@${config.tiktok}?_t=8pxVIfRQge8&_r=1`} className="social-icon" aria-label="TikTok">
            <FaTiktok />
          </a> 
        : null }
        {config.instagram ? 
          <a href={`https://www.instagram.com/${config.instagram}`} className="social-icon" aria-label="Instagram">
            <FaInstagram />
          </a> 
        : null }
        {config.whatsapp ? 
          <a href={`https://wa.me/34${config.whatsapp}`} className="social-icon" aria-label="WhatsApp">
            <FaWhatsapp />
          </a> 
        : null }
      </div>
    </div>
  );
};

export default AboutUs;
