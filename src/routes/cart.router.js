import {Router} from 'express'
/*import cartManager from '../dao/fileManagers/CartManager.js'*/
import cartManager from '../dao/mongoManagers/CartManager.js'

const router = Router()

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json({carts})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.get('/:cid', async (req,res) => {
    const {cid} = req.params
    try {
        const cartById = await cartManager.getCartsById(cid)
        res.status(200).json({message:'Cart', cartById})
    } catch (error) {
        res.status(500).json({error})
    }
} )

router.post('/', async (req,res) => {
    try {
        const newCart = await cartManager.addCart(req.body)
        res.status(200).json({message: 'Cart added', cart: newCart})
    } catch (error) {
        res.status(500).json({error})
    }
} )

router.post('/:cid/product/:pid', async (req,res) => {
    const {cid, pid} = req.params
    try {
        const newProductAdded = await cartManager.addProductToCart(cid, pid)
        res.status(200).json({message: 'Product added to cart', product: newProductAdded}) 
    } catch (error) {
        res.status(500).json({error})
    }
} )


router.put('/:cid', async (req,res) =>{
    const {cid} = req.params
    const products = req.body
    try {
        const response = await cartManager.updateCart(products, cid)
        res.status(200).json({message:'Cart updated', response})
    } catch (error){
        res.status(500).json({error})
    }
})

router.put('/:cid/product/:pid', async (req,res) =>{
    const {cid, pid} = req.params
    const quantity = req.body
    try {
        const productUpdated = await cartManager.updateQuantity(quantity, cid, pid)
        res.status(200).json({message: 'Quantity updated'})
    } catch (error){
        res.status(500).json({error})
    }
})

router.delete('/:cid/product/:pid', async (req,res) => {
    const {cid, pid} = req.params
    try {
        const response = await cartManager.deleteProductOnCart(cid, pid)
        res.status(200).json({message: 'Product deleted'})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.delete('/:cid', async (req,res) =>{
    const {cid} = req.params
    try {
        const response = await cartManager.deleteCart(cid)
        res.status(200).json({message:'Cart deleted'})
    } catch (error){
        res.status(500).json({error})
    }
})

export default router