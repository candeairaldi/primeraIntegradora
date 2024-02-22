import express from 'express';
import { ProductsManagerDB } from '../dao/product.manager.DB.js';

const router = express.Router();

router.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !status || !stock || !category || !thumbnails) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
    }
    next();
});

router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await ProductsManagerDB.getInstance().getProducts(limit);
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductsManagerDB.getInstance().getProductById(id);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let product = req.body;
        product = await ProductsManagerDB.getInstance().addProduct(product);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        let product = req.body;
        product = await ProductsManagerDB.getInstance().updateProduct(id, product);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const id = req.params.pid;
        const product = await ProductsManagerDB.getInstance().deleteProduct(id);
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 