import cartModel from './models/cart.model.js';
import { ProductsManagerDB } from './product.manager.DB.js';

export class CartsManagerDB {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!CartsManagerDB.#instance) {
            CartsManagerDB.#instance = new CartsManagerDB();
        }
        return CartsManagerDB.#instance;
    }

    async addCart() {
        try {
            let cart = {
                products: []
            };
            cart = await cartModel.create(cart);
            if (!cart) {
                throw new Error('No se pudo crear el carrito');
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            if (id.length !== 24) {
                throw new Error('El id debe tener 24 caracteres');
            }
            const cart = await cartModel.findById({ _id: id });
            if (!cart) {
                throw new Error(`No se encontró el carrito con id ${id}`);
            }
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProduct(cartId, productId) {
        try {
            await ProductsManagerDB.getInstance().getProductById(productId);
            let cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ productId: productId, quantity: 1 });
            }
            cart = await cartModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(cartId, productId) {
        try {
            let cart = await this.getCartById(cartId);
            const productIndex = cart.products.findIndex(product => product.productId === productId);
            if (productIndex === -1) {
                throw new Error(`No se encontró el producto con id ${productId} en el carrito con id ${cartId}`);
            } else {
                if (cart.products[productIndex].quantity > 1) {
                    cart.products[productIndex].quantity--;
                } else {
                    cart.products.splice(productIndex, 1);
                }
            }
            cart = await cartModel.findByIdAndUpdate(cartId, { products: cart.products }, { new: true });
            return cart;
        } catch (error) {
            throw error;
        }
    }
}