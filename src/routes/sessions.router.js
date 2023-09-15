import { Router } from "express";
import { usersModel } from "../db/models/users.models.js";
import passport from "passport";

const router = Router()

//passport-local
router.post("/register", passport.authenticate("register", {failureRedirect: "/views/registerError", successRedirect: "/views", passReqToCallback: true}))

router.post("/login", passport.authenticate("login",{failureRedirect: "/views/loginError", successRedirect: "/products", passReqToCallback: true}))


//register con Github
router.get('/registerGithub', passport.authenticate("github", { scope: [ 'user:email' ] }))
router.get('/github', passport.authenticate("github"), async (req,res) =>{
    req.session.email = req.user.email
    res.redirect("/products")
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({message:'Some data is missing!'})
    }

    const user = await usersModel.findOne({email})
    if(!user){
        return res.redirect("/api/views/loginError")
    }

    const isPasswordValid = await compareData(password,user.password)
  
    if(!isPasswordValid){
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

/*router.post('/register', async (req,res) => {
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
})*/

export default router