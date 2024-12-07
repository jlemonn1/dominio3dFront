import React from 'react';
import './Footer.css'; // Puedes crear un archivo CSS para personalizar el estilo si lo deseas
//import {config} from './config'

const Footer = ({ config }) => {
    return (

        
        <footer className="footer">
            {config.textFooter ? <p>{config.textFooter}</p> : null}
        </footer>
    );
};

export default Footer;
