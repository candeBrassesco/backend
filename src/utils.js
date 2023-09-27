import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = 'secretJWT'

//__dirname
export const __dirname = dirname(fileURLToPath(import.meta.url))

//hash
export const hashData = async (data) => {
    return bcrypt.hash(data,10)
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data,hashData)
}

// token
export const generateToken = (user) => {
    const token = jwt.sign( {user}, JWT_SECRET_KEY, {expiresIn: "1d"} )
    return token
}

//cookie extractor

export const cookieExtractor = (req) => {
    const token = req.cookies.token
    return token
}