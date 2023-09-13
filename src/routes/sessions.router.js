import { Router } from "express";
import { usersModel } from "../db/models/users.models.js";


const router = Router()

router.post('/register', async (req,res) => {
    const { first_name, last_name, email, age, password } = req.body

    const userExists = await usersModel.findOne({email})
    if(userExists) {
        res.redirect("/api/views/registerError")
    }

    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password, 
        role: email.includes("admin") ? "admin" : "user" 
    }
    const newUser = await usersModel.create(user)
    console.log(newUser)
    res.status(200).send({message: "User created", user: newUser})
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body

    const user = await usersModel.findOne({email, password})
    if(!user){
        res.redirect("/api/views/loginError")
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name} `,
        email: `${user.email}`,
        age: `${user.age}`
    }

    res.status(200).send({payload:req.res.user, message:"First login"})
})

router.get('/logout', async (req,res) => {
    req.session.destroy(error =>{
        if (error) return res.status(500).json({message: "Error login out"})
        res.redirect('/api/views/login')
    })

})

export default router