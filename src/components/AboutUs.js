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
      <h1 className="about-us-title">Conócenos</h1>
      <p className="about-us-description">
      Annubis Collection nació en Toledo en 2019  con el objetivo de juntar distintas mitologías en las prendas de vestir sin que tuvieran la necesidad de tener correlación, duró unos 4 meses hasta que me di cuenta que solo era imposible de llevarlo solo. Hasta el verano de 2023 que un amigo me animó a darle una segunda oportunidad con apoyo, renaciendo ahí la nueva imagen e idea plasmada en el nuevo eslogan de la marca:
(FOR ALL THE LOVERS, MY DEMONS WON TODAY), el ying y el yang:

      </p>
      <p className="about-us-description">
        En nuestro eslogan se hace referencia a la vida misma, a lo bueno y lo malo y como tienen que coexistir en este caso lo bueno seria FOR ALL THE LOVERS y lo malo MY DEMONS WON TODAY.
      </p>
      <p className="about-us-description">
        Trabajamos las tendencias pero sobre todo con nuestra visión y con un estilo adaptado al uso diario de nuestras prendas
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
