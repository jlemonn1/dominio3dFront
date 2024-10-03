// src/components/ScrollToForm.js
import { useRef, useEffect } from 'react';

const ScrollToForm = ({ isVisible }) => {
    const formRef = useRef(null);

    useEffect(() => {
        if (isVisible && formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isVisible]);

    return <div ref={formRef} />;
};

export default ScrollToForm;
