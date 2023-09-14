import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

//__dirname
export const __dirname = dirname(fileURLToPath(import.meta.url))

//hash
export const hashData = async (data) => {
    return bcrypt.hash(data,10)
}

export const compareData = async (data, hashData) => {
    return bcrypt.compare(data,hashData)
}