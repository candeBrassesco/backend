import { Router } from "express";

const router = Router()

router.post('/', (req,res) => {
    const {email, password} = req.body
    req.session['email'] = email
    req.session['password'] = password
    console.log(req);
    res.send('Welcome')
})

export default router
