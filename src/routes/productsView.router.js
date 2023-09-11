import { Router } from "express";
import productManager from "../dao/mongoManagers/ProductManager.js";

const router = Router()

router.get('/', async (req,res) => {
    const {limit = 10, page = 1, sort, ...query } = req.query
    try {
        const products = await productManager.getProducts(limit, page, sort, query)
        res.render("products", {products: products.payload})
    } catch (error) {
        return error
    }
})

export default router