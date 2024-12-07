import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProductForm from './ProductForm';
import ProductItem from './ProductItem'; // Asegúrate de importar correctamente tu componente

const ProductList = ({ config }) => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState({});
    const formRef = useRef(null);
    const apiUrl = config.apiUrl;

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const response = await axios.get(`${config.apiUrl}/api/products`);
        setProducts(response.data);
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/category`);
            const categoriesData = response.data;

            const groupedCategories = new Map();

            categoriesData.forEach(category => {
                const { category: categoryName, id } = category;

                if (categoryName.length > 0) {
                    if (groupedCategories.has(categoryName)) {
                        groupedCategories.get(categoryName).push(id);
                    } else {
                        groupedCategories.set(categoryName, [id]);
                    }
                }
            });

            setCategories(Object.fromEntries(groupedCategories));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormVisible(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${apiUrl}/api/products/${id}`);
        fetchProducts();
    };

    const handleSave = () => {
        setEditingProduct(null);
        setIsFormVisible(false);
        fetchProducts();
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        !isFormVisible ? setIsFormVisible(true) : setIsFormVisible(false);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>Productos</Typography>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAddNew}>
                {!isFormVisible ? 'Añadir nuevo producto' : 'Cancelar nuevo producto'}
            </Button>

            {isFormVisible && (
                <ProductForm
                    ref={formRef}
                    productToEdit={editingProduct}
                    config={config}
                    onSave={handleSave}
                />
            )}


            {Object.keys(categories).map((category, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{category}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <List>
                            {products
                                .filter(product => categories[category].includes(product.catId))
                                .map(product => (
                                    <ListItem key={product.id} style={{ padding: '10px' }}>
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={product.name}
                                                src={product.imageUrl || '/placeholder.jpg'}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`Precio: €${product.price}`}
                                        />
                                        <IconButton
                                            edge="end"
                                            aria-label="edit"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    );
};

export default ProductList;
