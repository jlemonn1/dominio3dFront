import React, { useState, useEffect, useRef } from 'react';
import './PromoBanner.css';
import videoMovil from './img/videoMovil.mp4';
import videoPc from './img/videoPc.mp4';

const VideoFin = () => {
    const [currentVideo, setCurrentVideo] = useState(videoMovil);
    const videoRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia('(min-width: 600px)').matches) {
                setCurrentVideo(videoPc);
            } else {
                setCurrentVideo(videoMovil);
            }
        };

        // Ejecutar la función al cargar el componente
        handleResize();

        // Escuchar cambios en el tamaño de la pantalla
        window.addEventListener('resize', handleResize);

        // Limpiar el evento al desmontar el componente
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="promo-banner">
            <div className="promo-video">
                <video
                    ref={videoRef}
                    src={currentVideo}
                    alt="Inicio Promo"
                    muted
                    playsInline
                    autoPlay
                    loop // Hacer que el video siempre esté en bucle
                    style={{ width: '100%', height: 'auto' }} // Para que ocupe el 100% del contenedor
                />
            </div>
        </div>
    );
};

export default VideoFin;
