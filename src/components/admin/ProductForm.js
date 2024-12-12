import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import imageCompression from 'browser-image-compression';
import { FaEdit, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import './admin.css';
import ClipLoader from 'react-spinners/ClipLoader'; // Ejemplo de spinner

import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Firebase
import { initializeApp } from "firebase/app"; // Firebase

const firebaseConfig = {
    apiKey: "AIzaSyAKYBIEHieGaIr9Yl7BA-yZu6ufRaE271k",
    authDomain: "annubis-web-storage.firebaseapp.com",
    projectId: "annubis-web-storage",
    storageBucket: "annubis-web-storage.firebasestorage.app",
    messagingSenderId: "137386375071",
    appId: "1:137386375071:web:a370e57b4c5521ac726faa",
    measurementId: "G-Y001MQMZFL"
  };

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const ProductForm = forwardRef(({ productToEdit, onSave, config }, ref) => {
    const apiUrl = config.apiUrl;
    const [product, setProduct] = useState({
        name: '',
        catId: '',
        description: '',
        price: 0,
        variants: [],
        locker: false,
        bestFriends: false,
        collection: '',
    });

    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);

    const formRef = useRef(null);

    

    useImperativeHandle(ref, () => ({
        scrollIntoView: () => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        },
    }));

    useEffect(() => {
        fetchCategories();
        if (productToEdit) {
            setProduct(productToEdit);
        } else {
            resetForm();
        }
    }, [productToEdit]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/category`); // Cambia la URL si es necesario
            const categoriesData = response.data;

            const groupedCategories = {};

            categoriesData.forEach(item => {
                const { category, subCategory, id } = item;

                // Si la categoría no existe, la creamos
                if (!groupedCategories[category]) {
                    groupedCategories[category] = [];
                }

                // Agregar subcategoría a la categoría correspondiente
                groupedCategories[category].push({ subCategory, id });
            });

            setCategories(groupedCategories);
        } catch (error) {
            console.error('Error al obtener categorías:', error);
        }
    };

    const resetForm = () => {
        setProduct({
            name: '',
            catId: '',
            description: '',
            price: 0,
            variants: [],
            locker: false,
            bestFriends: false,
            collection: '',
        });
        setSelectedFiles([]);
        setEditingVariantIndex(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {

        console.log("Estoy comprimiendo");
        const files = Array.from(e.target.files);
        const totalSize = files.reduce((acc, file) => acc + file.size, 0);

        if (totalSize > 30 * 1024 * 1024) {
            setErrorMessage('El tamaño total de los archivos seleccionados no puede exceder los 30MB.');
            return;
        }

        //const compressedFiles = await Promise.all(files.map(file => imageCompression(file, {
        //    maxSizeMB: 1,
        //    maxWidthOrHeight: 1920,
        //    useWebWorker: true,
        //})));



        setSelectedFiles(files);
        console.log("SeleccionadoS");
    };

    const handleVariantChange = (field, value) => {
        if (editingVariantIndex !== null) {
            const updatedVariants = [...product.variants];
            updatedVariants[editingVariantIndex] = {
                ...updatedVariants[editingVariantIndex],
                [field]: value
            };
            setProduct(prev => ({ ...prev, variants: updatedVariants }));
        }
    };

    const addVariant = () => {
        setProduct(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', stock: 0 }],
        }));


        setEditingVariantIndex(product.variants.length);
    };

    const deleteVariant = (index) => {
        const updatedVariants = [...product.variants];
        updatedVariants.splice(index, 1);

        // Si se elimina la variante que se está editando o si el índice queda fuera de rango
        if (editingVariantIndex === index || editingVariantIndex >= updatedVariants.length) {
            setEditingVariantIndex(null); // Resetea la edición
        }

        setProduct(prev => ({ ...prev, variants: updatedVariants }));
    };

    const editVariant = (index) => {
        setEditingVariantIndex(index);
    };

    const uploadFiles = async (productId, files) => {
        try {
            console.log("Estoy subiendo imagenes");
            
            const uploadedUrls = await Promise.all(
                Array.from(files).map(async (file) => {
                    const fileStorageRef = storageRef(storage, `products/${productId}/${file.name}`);
                    await uploadBytes(fileStorageRef, file);
                    return await getDownloadURL(fileStorageRef);
                })
            );

            console.log("Estoy aqui");
    
            const url = `${apiUrl}/api/products/${productId}/images`;
    
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(uploadedUrls)
            });
        } catch (error) {
            console.error('Error al subir archivos:', error);
            throw new Error('Error al subir archivos: ' + error.message);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
    
        const cleanedVariants = product.variants.filter(variant => variant.stock);
    
        try {
            let productId;
            const productToSave = { ...product, variants: cleanedVariants };
    
            if (productToEdit) {
                const response = await fetch(`${apiUrl}/api/products/${productToEdit.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productToSave)
                });
                const responseData = await response.json();
                productId = responseData.id;
            } else {
                const response = await fetch(`${apiUrl}/api/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productToSave)
                });
                const responseData = await response.json();
                productId = responseData.id;
            }
    
            if (selectedFiles.length > 0) {
                await uploadFiles(productId, selectedFiles);
            }
    
            onSave();
            resetForm();
        } catch (error) {
            setErrorMessage('Error al guardar el producto: ' + error.message);
        } finally {
            setLoading(false);
        }
    };
    


    return (
        <form className="admin-form" onSubmit={handleSubmit} ref={formRef}>
            <label>
                Nombre:
                <input type="text" name="name" value={product.name} onChange={handleChange} required />
            </label>
            <label>
                Categoría:
                <select name="catId" value={product.catId} onChange={handleChange} required>
                    <option value="">Selecciona una categoría</option>
                    {Object.entries(categories).map(([category, subCategories]) => (
                        subCategories.filter(({ subCategory }) => subCategory !== "").length > 0 ? (
                            <optgroup key={category} label={category}>
                                {subCategories
                                    .filter(({ subCategory }) => subCategory !== "") // Filtra las subcategorías vacías
                                    .map(({ subCategory, id }) => (
                                        <option key={id} value={id}>{subCategory}</option>
                                    ))}
                            </optgroup>
                        ) : (
                            <option key={subCategories[0]?.id} value={subCategories[0]?.id}>{category}</option>
                            // Usa el id de la categoría cuando no hay subcategorías
                        )
                    ))}


                </select>
            </label>
            <label>
                Descripción:
                <textarea name="description" value={product.description} onChange={handleChange} required />
            </label>
            <label>
                Precio:
                <input type="number" name="price" value={product.price} onChange={handleChange} required />
            </label>
            <label>
                Colección:
                <input type="text" name="collection" value={product.collection} onChange={handleChange} />
            </label>
            <label>
                Visibilidad:
                <select name="visibility" onChange={(e) => {
                    const selectedVisibility = e.target.value;
                    setProduct(prev => ({
                        ...prev,
                        locker: selectedVisibility === 'locker',
                        bestFriends: selectedVisibility === 'family&friend'
                    }));
                }} required>
                    <option value="">Selecciona una opción de visibilidad</option>
                    <option value="main">Main</option>
                    <option value="family&friend">Family & Friends</option>
                    <option value="locker">Locker</option>
                </select>
            </label>

            {/* Variantes */}
            <div>
                <h3>Variantes:</h3>
                <ul className="variant-list">
                    {product.variants.map((variant, index) => (
                        <li key={index} className="variant-item">
                            <span>{variant.size} / Stock: {variant.stock}</span>
                            <div className="variant-buttons">
                                <button type="button" onClick={() => editVariant(index)}>
                                    <FaEdit />
                                </button>
                                <button type="button" onClick={() => deleteVariant(index)}>
                                    <FaTrashAlt />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {editingVariantIndex !== null && (
                    <div className="variant-edit-form">
                        <label>
                            Tamaño:
                            <input type="text" value={product.variants[editingVariantIndex].size} onChange={(e) => handleVariantChange('size', e.target.value)} />
                        </label>
                        <label>
                            Stock:
                            <input type="number" value={product.variants[editingVariantIndex].stock} onChange={(e) => handleVariantChange('stock', e.target.value)} required />
                        </label>
                    </div>
                )}

                <button type="button" onClick={addVariant} className="admin-button">
                    <FaPlusCircle /> Agregar Variante
                </button>
            </div>

            <label>
                Imágenes:
                <input type="file" multiple onChange={handleFileChange} />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {loading ? (
                <ClipLoader color={"#123abc"} loading={loading} size={35} />
            ) : (
                <button className="admin-button" type="submit">Guardar</button>
            )}
        </form>
    );
});

export default ProductForm;
