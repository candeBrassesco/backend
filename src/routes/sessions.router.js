import { Router } from "express";
import { usersModel } from "../db/models/users.models.js";
import { hashData } from "../utils.js";


const router = Router()

router.post('/register', async (req,res) => {

    const { first_name, last_name, email, age, password } = req.body
    
    if(!first_name || !last_name || !email || !age || !password) {
        return res.status(400).json({message:'Some data is missing!'})
    }
    const userExists = await usersModel.findOne({email})
    if(userExists) {
        return res.redirect("/api/views/registerError")
    }

    const hashPassword = await hashData(password)

    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password: hashPassword
    }

    const newUser = await usersModel.create(user)
    console.log(newUser)
    res.status(200).send({message: "User created", user: newUser})
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body

    const user = await usersModel.findOne({email, password})
    if(!user){
        return res.redirect("/api/views/loginError")
    }

    const role = user.email.includes("admin") ? "admin" : "user"

    req.session.user = {
        name: `${user.first_name} ${user.last_name} `,
        email: `${user.email}`,
        age: `${user.age}`,
        role
    }

    res.redirect('/products')
})

router.get('/logout', async (req,res) => {
    req.session.destroy(error =>{
        if (error) return res.status(500).json({message: "Error login out"})
        res.redirect('/api/views/login')
    })

})

export default router