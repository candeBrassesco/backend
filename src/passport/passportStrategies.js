import passport from "passport";
import { usersModel } from "../db/models/users.models.js";
import {Strategy as LocalStrategy} from "passport-local"
import { Strategy as GithubStrategy } from "passport-github2";
import { compareData } from "../utils.js";
import { hashData } from "../utils.js";
import { ProfilingLevel } from "mongodb";

passport.use('login', new LocalStrategy(
    async function (email, password, done) {
        try {
            const user = await usersModel.findOne({email})
            if(!user) {
                return done( null, false )
            }
        
            const isPasswordValid = await compareData(password,user.password)
            if(!isPasswordValid) {
                return done( null, false )
            }

            return done( null, user )
        } catch (error) {
            done(error)
        }
    }
))

passport.use('register', new LocalStrategy(
    async function (req, email, password, done) {
        try {
            const user = await usersModel.findOne({email})
            if(user) {
                return done ( null, false )
            }
            const hashPassword = await hashData(password)
            const newUser = {...req.body, password: hashPassword}
            const userDB = await usersModel.create(newUser)
            done( null, userDB )
        } catch (error) {
            done(error)
        }
    }
))


passport.use(new GithubStrategy({
    clientID: 'Iv1.951aef74a091d5dd',
    clientSecret: 'bd230677e69cc71a930aec10643d7a20cefee8c2',
    callbackURL: "http://localhost:8080/api/session/github"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await usersModel.findOne({email:profile._json.email})
        if(user) {
           done( null, false )
        }
        const newUser = {
            first_name: profile.displayName.split(' ') [0],
            last_name: profile.displayName.split(' ') [1] || ' ',
            email: profile._json.email,
            password: ' '
        }
        const userDB = await usersModel.create(newUser)
        done( null, userDB )
    } catch (error) {
        done(error)
    }
  }
));

// user => ID
passport.serializeUser(( user, done ) => {
    done( null, user._id )
})

// ID => user data
passport.deserializeUser(async( id, done ) =>{
    try {
        const user = await usersModel.findById(id)
        done( null, user )
    } catch (error) {
        done(error)
    }
}) 