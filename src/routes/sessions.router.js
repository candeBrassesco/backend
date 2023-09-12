import { Router } from "express";
import { usersModel } from "../db/models/users.models.js";


const router = Router()

router.post('/register', async (req,res) => {
    const {first_name, last_name, email, age, password} = req.body

    try {
        const userExists = await usersModel.findOne({email})

        if(userExists) {
            return res.status(400).send({status:"error", error: "User already exists"})
        }
        const user = {
            first_name, last_name, email, age, password 
        }
        const newUser = await usersModel.create(user)
        res.status(200).send({message: "User created", user: newUser})
    } catch (error) {
        res.status(500).json(error)
    }
} )

router.post('/login', async (req,res) => {
   const {email, password} = req.body
   
   try {
       const user = await usersModel.findOne({email, password})

       if(!user){
          res.status(400).send({status:"error", error: "Please enter a correct email or password"})
       }

       req.session.user = {
          name: `${user.first_name} ${user.last_name} `,
          email: `${user.email}`,
          age: `${user.age}`
       }

       res.status(200).send({payload:req.res.user, message:"First login"})

   } catch (error) {
       res.status(500).json(error)
   }
})

router.get('/logout', async (req,res) => {
    req.session.destroy(error =>{
        if (error) return res.status(500).json({message: "Error login out"})
        res.redirect('/login')
    })

})

export default router