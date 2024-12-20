import React, { useEffect, useState, useRef } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importa los íconos
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import imageCompression from 'browser-image-compression';
import ClipLoader from 'react-spinners/ClipLoader'; // Ejemplo de spinner
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Firebase
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

// Inicializa Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const CategoryAdmin = ({ config }) => {
    const apiUrl = config.apiUrl;
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategory, setNewCategory] = useState({ category: '', subCategory: '', imgUrl: '' });
    const [editCategory, setEditCategory] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
    const [loadingImage, setLoadingImage] = useState(false);

    const formRef = useRef(null);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/category`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [apiUrl]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = editCategory
                ? await fetch(`${apiUrl}/api/category/${editCategory.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCategory),
                })
                : await fetch(`${apiUrl}/api/category`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCategory),
                });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const updatedCategory = await response.json();
            setCategories(prevCategories =>
                editCategory
                    ? prevCategories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
                    : [...prevCategories, updatedCategory]
            );
            setNewCategory({ category: '', subCategory: '', imgUrl: '' });
            setEditCategory(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async () => {
        if (!categoryIdToDelete) return;
        try {
            const response = await fetch(`${apiUrl}/api/category/${categoryIdToDelete}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            setCategories(categories.filter(cat => cat.id !== categoryIdToDelete));
            setConfirmDialogOpen(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDelete = (categoryId) => {
        setCategoryIdToDelete(categoryId);
        setConfirmDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setConfirmDialogOpen(false);
        setCategoryIdToDelete(null);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setNewCategory({ ...newCategory, [name]: value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleEdit = (category) => {
        setNewCategory({ category: category.category, subCategory: category.subCategory, imgUrl: category.imgUrl });
        setEditCategory(category);

        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFile || !editCategory) return;

        try {
            setLoadingImage(true);

            const options = {
                maxSizeMB: 5.5,
                useWebWorker: true,
            };

            const compressedFile = await imageCompression(selectedFile, options);

            const storageRef = ref(storage, `categories/${editCategory.id}`);
            await uploadBytes(storageRef, compressedFile);

            const downloadURL = await getDownloadURL(storageRef);

            setNewCategory({ ...newCategory, imgUrl: downloadURL });

            const response = await fetch(`${apiUrl}/api/category/${editCategory.id}/image`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imgUrl: downloadURL }),
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const updatedCategory = await response.json();
            setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingImage(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!editCategory) return;
        try {
            const storageRef = ref(storage, `categories/${editCategory.id}`);
            await deleteObject(storageRef);

            const response = await fetch(`${apiUrl}/api/category/${editCategory.id}/remove-image`, {
                method: 'PUT',
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const updatedCategory = await response.json();
            setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
            setNewCategory({ ...newCategory, imgUrl: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const groupedCategories = categories.reduce((acc, category) => {
        (acc[category.category] = acc[category.category] || []).push(category);
        return acc;
    }, {});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className='category-manager-admin' ref={formRef}>
            <h3>Administrar Categorías</h3>
            <form onSubmit={handleSubmit} className='category-form'>
                <input
                    type='text'
                    name='category'
                    placeholder='Categoría'
                    value={newCategory.category}
                    onChange={handleChange}
                    required
                    className='category-input'
                />
                <input
                    type='text'
                    name='subCategory'
                    placeholder='Subcategoría'
                    value={newCategory.subCategory}
                    onChange={handleChange}
                    className='subcategory-input'
                />
                <button type='submit' className='submit-btn'>
                    {editCategory ? 'Actualizar' : 'Agregar'}
                </button>
            </form>

            {editCategory && (
                <div className='image-upload-section'>
                    <h4>Imagen</h4>
                    {loadingImage ? (
                        <div className="loading-spinner">
                            <ClipLoader color={"#123abc"} loading={loadingImage} size={35} />
                        </div>
                    ) : (
                        !newCategory.imgUrl ? (
                            <div>
                                <input type='file' onChange={handleFileChange} className='file-input' />
                                <button onClick={handleImageUpload} className='upload-btn'>Subir Imagen</button>
                            </div>
                        ) : (
                            <div className='image-preview'>
                                <img src={newCategory.imgUrl} alt={newCategory.category} className='current-image' />
                                <button onClick={handleRemoveImage} className='remove-image-btn'>Eliminar Imagen</button>
                            </div>
                        )
                    )}
                </div>
            )}

            <div className='category-list'>
                {Object.keys(groupedCategories).map(category => (
                    <div key={category} className='category-group'>
                        <h5 className='category-title'>{category}</h5>
                        <ul className='subcategory-list'>
                            {groupedCategories[category].map(cat => (
                                <li key={cat.id} className='subcategory-item'>
                                    <p className='subcategory-name'>{cat.subCategory || 'Sin subcategoría'}</p>
                                    {cat.imgUrl && <img src={cat.imgUrl} alt={cat.category} className='subcategory-image' />}
                                    <div className='action-buttons'>
                                        <FaEdit onClick={() => handleEdit(cat)} className='edit-icon' />
                                        <FaTrash onClick={() => confirmDelete(cat.id)} className='delete-icon' />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar esta categoría?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color='primary'>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CategoryAdmin;
