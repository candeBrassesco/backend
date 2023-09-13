import {Router} from 'express'
/*import productManager from '../dao/fileManagers/ProductManager.js';*/
import productManager from '../dao/mongoManagers/ProductManager.js'

const router = Router()

router.get("/", async (req, res) => {
    try {
        const {limit = 10, page = 1, sort, ...query} = req.query
        const products = await productManager.getProducts(limit, page, sort, query)
        res.status(200).json({products})  
    } catch(error){
        res.status(500).json({error})
    }
})

router.get("/:pid", async (req, res) => {
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(pid)
        if (!product) {
          res.status(400).json({ message:'Invalid ID' })
        } else {
          res.status(200).json({ message:'Product', product })
        }
    } catch (error){
        res.status(500).json({error})
    }
})

router.post('/', async(req,res) => {
    // verifico que los valores que si o si deben estar esten antes
    const {title, description, price, code} = req.body
    if ( !title || !description || !price || !code ) {
        return res.status(400).json({message: 'Some data is missing'})
    }
    try {
        const newProduct = await productManager.addProduct(req.body)
        res.status(200).json({message: 'Product added', product: newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.delete('/:pid', async(req,res) => {
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(pid)
        if (!product) {
          return res.status(400).json({ message:'Invalid ID' }) 
        }
        const deleteProduct= await productManager.deleteProduct(pid)
        res.status(200).json({message:'Product deleted', product: deleteProduct})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.put('/:pid', async (req,res) => {
    const productUpdate = req.body
    const {pid} = req.params
    if (!productUpdate) {
        return res.status(400).json({message: 'Please enter updates'})
    }
    try {
        const product = await productManager.getProductById(pid)
        if (!product) {
           res.status(400).json({ message:'Invalid ID' }) 
        }
        const productUpdated = await productManager.updateProduct(pid, productUpdate)
        req.status(200).json({message:'Product updated', product: productUpdated})
    } catch (error){
        res.status(500).json({error})
    }
})

export default router
