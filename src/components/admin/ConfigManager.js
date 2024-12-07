import React, { useEffect, useState } from 'react';

const themeOptions = [
    {
        name: 'Rainbow Unicorn',
        background: '#f8e1ff',
        text: '#ff69b4',
        textHover: '#ff1493',
        buttonBg: '#ffb6c1',
        buttonHover: '#ff69b4',
        colorBackgroundBanner: '#ffe4e1',
        colorTextBanner: '#ff1493',
        colorBackgroundShopnow: '#f8e1ff',
        colorTextBorderShopnow: '#ff69b4',
        colorFooterBg: '#ff69b4',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Dark Knight',
        background: '#1c1c1c',
        text: '#ffffff',
        textHover: '#f0e68c',
        buttonBg: '#333333',
        buttonHover: '#f0e68c',
        colorBackgroundBanner: '#000000',
        colorTextBanner: '#f0e68c',
        colorBackgroundShopnow: '#333333',
        colorTextBorderShopnow: '#ffffff',
        colorFooterBg: '#000000',
        colorFooterText: '#f0e68c'
    },
    {
        name: 'Sunny Day',
        background: '#ffeb3b',
        text: '#ff5722',
        textHover: '#ffc107',
        buttonBg: '#ff9800',
        buttonHover: '#ff5722',
        colorBackgroundBanner: '#ffeb3b',
        colorTextBanner: '#ff5722',
        colorBackgroundShopnow: '#ff9800',
        colorTextBorderShopnow: '#ff5722',
        colorFooterBg: '#ffc107',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Ocean Breeze',
        background: '#e0f7fa',
        text: '#00796b',
        textHover: '#004d40',
        buttonBg: '#80deea',
        buttonHover: '#00796b',
        colorBackgroundBanner: '#00bcd4',
        colorTextBanner: '#004d40',
        colorBackgroundShopnow: '#80deea',
        colorTextBorderShopnow: '#004d40',
        colorFooterBg: '#004d40',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Candy Crush',
        background: '#ffe4e1',
        text: '#ff1493',
        textHover: '#ff69b4',
        buttonBg: '#ffb6c1',
        buttonHover: '#ff1493',
        colorBackgroundBanner: '#ffe4e1',
        colorTextBanner: '#ff69b4',
        colorBackgroundShopnow: '#ffb6c1',
        colorTextBorderShopnow: '#ff1493',
        colorFooterBg: '#ff1493',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Mossy Woods',
        background: '#dcedc8',
        text: '#558b2f',
        textHover: '#33691e',
        buttonBg: '#8bc34a',
        buttonHover: '#558b2f',
        colorBackgroundBanner: '#aed581',
        colorTextBanner: '#33691e',
        colorBackgroundShopnow: '#8bc34a',
        colorTextBorderShopnow: '#558b2f',
        colorFooterBg: '#33691e',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Midnight Purple',
        background: '#673ab7',
        text: '#d1c4e9',
        textHover: '#512da8',
        buttonBg: '#9575cd',
        buttonHover: '#7e57c2',
        colorBackgroundBanner: '#d1c4e9',
        colorTextBanner: '#512da8',
        colorBackgroundShopnow: '#9575cd',
        colorTextBorderShopnow: '#7e57c2',
        colorFooterBg: '#512da8',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Lava Lamp',
        background: '#ff5722',
        text: '#ffffff',
        textHover: '#ff7043',
        buttonBg: '#e64a19',
        buttonHover: '#ff7043',
        colorBackgroundBanner: '#ff5722',
        colorTextBanner: '#ffffff',
        colorBackgroundShopnow: '#e64a19',
        colorTextBorderShopnow: '#ff7043',
        colorFooterBg: '#d84315',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Frozen Dreams',
        background: '#e0f7fa',
        text: '#0288d1',
        textHover: '#03a9f4',
        buttonBg: '#81d4fa',
        buttonHover: '#0288d1',
        colorBackgroundBanner: '#00bcd4',
        colorTextBanner: '#0288d1',
        colorBackgroundShopnow: '#81d4fa',
        colorTextBorderShopnow: '#03a9f4',
        colorFooterBg: '#0288d1',
        colorFooterText: '#ffffff'
    },
    {
        name: 'Tropical Fiesta',
        background: '#ffe082',
        text: '#ff7043',
        textHover: '#f4511e',
        buttonBg: '#ffb74d',
        buttonHover: '#ff7043',
        colorBackgroundBanner: '#ffcc80',
        colorTextBanner: '#f4511e',
        colorBackgroundShopnow: '#ffe082',
        colorTextBorderShopnow: '#f4511e',
        colorFooterBg: '#ff7043',
        colorFooterText: '#ffffff'
    }
];

const ConfigManager = ({config}) => {
    const [config2, setConfig] = useState({});
    const [updatedConfig, setUpdatedConfig] = useState({});
    const [activeSection, setActiveSection] = useState(null);
    const [selectedTheme, setSelectedTheme] = useState(themeOptions[0]);
    const [isAdvanced, setIsAdvanced] = useState(false);

    useEffect(() => {
        fetch(`${config.apiUrl}/api/config`)
            .then(response => response.json())
            .then(data => {
                setConfig(data);
                setUpdatedConfig(data); // Inicializa el estado de actualización
            })
            .catch(error => console.error('Error fetching config:', error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        fetch(`${config.apiUrl}/api/config`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedConfig),
        })
            .then(response => response.json())
            .then(data => {
                setConfig(data);
                alert('Configuración guardada!');
                window.location.reload();
            })
            .catch(error => console.error('Error saving config:', error));
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const applyTheme = (theme) => {
        setSelectedTheme(theme);
        setUpdatedConfig(prev => ({ ...prev, ...theme }));
    };

    return (
        <div className='config-manager'>
            <h3>Configuraciones</h3>

           

            {/* Sección de Configuración General */}
            <div>
                <h5 onClick={() => toggleSection('general')} style={{ cursor: 'pointer' }}>
                    Configuración General
                </h5>
                {activeSection === 'general' && (
                    <div>
                        <label>
                            Contraseña:
                            <input
                                type="password"
                                name="password"
                                value={updatedConfig.password || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Envío Gratis:
                            <input
                                type="number"
                                name="envioGratis"
                                value={updatedConfig.envioGratis || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleSave} className='admin-button'>Guardar Configuración General</button>
                    </div>
                )}
            </div>

            {/* Sección de Banner */}
            <div>
                <h5 onClick={() => toggleSection('banner')} style={{ cursor: 'pointer' }}>
                    Banner
                </h5>
                {activeSection === 'banner' && (
                    <div>
                        <label>
                            Texto Banner 1:
                            <input
                                type="text"
                                name="textBanner1"
                                value={updatedConfig.textBanner1 || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Texto Banner 2:
                            <input
                                type="text"
                                name="textBanner2"
                                value={updatedConfig.textBanner2 || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleSave} className='admin-button'>Guardar Banner</button>
                    </div>
                )}
            </div>

            {/* Sección de Redes Sociales */}
            <div>
                <h5 onClick={() => toggleSection('social')} style={{ cursor: 'pointer' }}>
                    Redes Sociales
                </h5>
                {activeSection === 'social' && (
                    <div>
                        <label>
                            Instagram:
                            <input
                                type="text"
                                name="instagram"
                                value={updatedConfig.instagram || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            TikTok:
                            <input
                                type="text"
                                name="tiktok"
                                value={updatedConfig.tiktok || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            WhatsApp:
                            <input
                                type="text"
                                name="whatsapp"
                                value={updatedConfig.whatsapp || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleSave} className='admin-button'>Guardar Redes Sociales</button>
                    </div>
                )}
            </div>

            {/* Sección de Texto Personalizado */}
            <div>
                <h5 onClick={() => toggleSection('customText')} style={{ cursor: 'pointer' }}>
                    Texto Personalizado
                </h5>
                {activeSection === 'customText' && (
                    <div>
                        <label>
                            Línea Uno:
                            <input
                                type="text"
                                name="lineaUno"
                                value={updatedConfig.lineaUno || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Línea Dos:
                            <input
                                type="text"
                                name="lineaDos"
                                value={updatedConfig.lineaDos || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Línea Tres:
                            <input
                                type="text"
                                name="lineaTres"
                                value={updatedConfig.lineaTres || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Botón Comprar:
                            <input
                                type="text"
                                name="botonComprar"
                                value={updatedConfig.botonComprar || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleSave} className='admin-button'>Guardar Texto Personalizado</button>
                    </div>
                )}
            </div>

            {/* Sección de Footer */}
            <div>
                <h5 onClick={() => toggleSection('footer')} style={{ cursor: 'pointer' }}>
                    Footer
                </h5>
                {activeSection === 'footer' && (
                    <div>
                        <label>
                            Texto del Footer:
                            <input
                                type="text"
                                name="textFooter"
                                value={updatedConfig.textFooter || ''}
                                onChange={handleChange}
                            />
                        </label>
                        <button onClick={handleSave} className='admin-button'>Guardar Footer</button>
                    </div>
                )}
            </div>

             {/* Sección de selección de tema 
            <div>
                <h5 onClick={() => toggleSection('theme')}>Seleccionar Tema</h5>
                {activeSection === 'theme' && (
                <><select
                        onChange={(e) => applyTheme(themeOptions[e.target.value])}
                        value={themeOptions.findIndex(theme => theme.name === selectedTheme.name)}
                    >
                        {themeOptions.map((theme, index) => (
                            <option key={index} value={index}>
                                {theme.name}
                            </option>
                        ))}
                    </select><button onClick={() => setIsAdvanced(!isAdvanced)} className='admin-button'>
                            {isAdvanced ? 'Ocultar Edición Avanzada' : 'Mostrar Edición Avanzada'}
                        </button></>
                )}
            </div>

            {/* Sección de Edición Avanzada 
            {isAdvanced && (
                <div className='advanced-editor'>
                    <h5>Edición Avanzada del Tema</h5>
                    <label>
                        Color de Fondo:
                        <input
                            type="color"
                            name="background"
                            value={updatedConfig.background || '#ffffff'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color de Texto:
                        <input
                            type="color"
                            name="text"
                            value={updatedConfig.text || '#000000'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color de Fondo del Botón:
                        <input
                            type="color"
                            name="buttonBg"
                            value={updatedConfig.buttonBg || '#ffffff'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color de Hover del Botón:
                        <input
                            type="color"
                            name="buttonHover"
                            value={updatedConfig.buttonHover || '#ffffff'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color de Fondo del Banner:
                        <input
                            type="color"
                            name="colorBackgroundBanner"
                            value={updatedConfig.colorBackgroundBanner || '#ffffff'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color del Texto del Banner:
                        <input
                            type="color"
                            name="colorTextBanner"
                            value={updatedConfig.colorTextBanner || '#000000'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color de Fondo del Footer:
                        <input
                            type="color"
                            name="colorFooterBg"
                            value={updatedConfig.colorFooterBg || '#ffffff'}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Color del Texto del Footer:
                        <input
                            type="color"
                            name="colorFooterText"
                            value={updatedConfig.colorFooterText || '#000000'}
                            onChange={handleChange}
                        />
                    </label>
                    <button onClick={handleSave} className='admin-button'>Guardar Tema Avanzado</button>
                </div>
                )}
            
            */}
            
            <div style={{ borderBottom: '1px solid #000', margin: '10px 0' }}></div>
        </div>
    );
};

export default ConfigManager;
