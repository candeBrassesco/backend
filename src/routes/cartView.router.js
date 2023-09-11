import { Router } from "express";
import cartManager from "../dao/mongoManagers/CartManager.js";

const router = Router()

router.get('/:cid', async (req,res) => {
    const {cid} = req.params
    try {
        const cart = await cartManager.getCartsById(cid)
        const cartProducts = cart.products
        res.render("cart", {products: cartProducts})
    } catch (error) {
        return error
    }
    
})

export default router