import { cartsModel } from "../../db/models/carts.models.js"

class CartManager {

    async getCarts() {
        try {
            const carts = await cartsModel.find({})
            return carts
        } catch (error){
            return error
        }
    }

    async getCartsById(id) {
        try {
            const cart = await cartsModel.findById(id).populate('products')
            console.log(cart) //test
            return cart
        } catch (error) {
            return error
        }
    }

    async addCart() {
        try {
            const newCart = await cartsModel.create({})
            return newCart
        } catch (error) {
            return error
        }
    }
    
    async addProductToCart(cid, pid) {
        try {
          const cartById = await cartsModel.findById(cid)
      
          const newProduct = {
            pid: pid,
            quantity: 1,
          }
      
          const prodOnCart = cartById.products.find((p) => p.pid == pid)
          console.log(prodOnCart)
      
          if (!prodOnCart) {
            cartById.products.push(newProduct)
          } else {
            prodOnCart.quantity++
          }
      
          const updatedCart = await cartById.save()
      
          return updatedCart
        } catch (error) {
          console.log(error)
          return error
        }
    }
  
    async deleteCart(cid) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                return new Error('Cart not found')
            }
            cart.products = []
            return await cartsModel.updateOne({_id: cid}, {$set:{products: cart.products}})
        } catch (error) {
            return error
        }
    }

    async deleteProductOnCart(cid, pid) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                throw new Error ('Cart not found')
            }
            const response = await cartsModel.updateOne({_id: cid}, {$pull:{products:{pid: pid}}})
            return response
        } catch (error) {
            return error
        }
    }

    async updateCart(products, cid) {
        try {
            const cart = await cartsModel.findById(cid)
            const cartToUpdate = {
                id: cid,
                products: products
            }
            return await cart.replaceOne(cartToUpdate)
        } catch (error) {
            return error
        }
    }

    async updateQuantity (quantity, cid, pid) {
        try {
            const cart = await cartsModel.findById(cid)
            const product = cart.products.find(p => p.pid == pid)

            const productToUpdate = {
                pid: pid,
                quantity: quantity.quantity
            }
            const indexProd = cart.products.indexOf(product)
            cart.products.splice(indexProd, 1)
            cart.products.push(productToUpdate)
            console.log(cart.products) // test
            cart.save()
            return cart
        } catch (error) {
            return error
        }
    }

}

const cartManager = new CartManager()
export default cartManager
