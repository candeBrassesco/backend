import { usersModel } from "../../db/models/users.models";

class UserManager {

    async createUser (user) {

        const {email, password} = user

        try {
            const userExists = await usersModel.find({email, password})

            if (userExists.length===0) {
                const newUser = await usersModel.create(user)
                return newUser
            } else {
                return null
            }
        } catch(error) {
            throw new Error(error)
        }

    }

    async loginUser(user) {

        const {email, password} = user
        
        try {
            const user = await usersModel.find({email, password})

            if(user.length!==0) {
                return user
            } else {
                return null
            }

        } catch (error) {
            return error
        }
    }

    async findUserByEmail(){
        
    }

}