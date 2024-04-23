import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {

    static createAccount = async (req : Request, res : Response) => {
        try {
            const {password} = req.body

            // Prevenir duplicados
            const userExists = await User.findOne({email : req.body.email})

            if(userExists) {
                const error = new Error('Ya existe una cuenta registrada con este correo')
                return res.status(409).json({error : error.message})
            }

            // Crea un usuario
            const user = new User(req.body)

            // Hash password
            user.password = await hashPassword(password)

            // Generar token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Cuenta creada correctamente, revisa tu email para confirmarla')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static confirmAccount = async (req : Request, res : Response) => {
        try {
            const {token} = req.body
            
            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Token no válido')
                return res.status(404).json({error : error.message})
            }

            const user = await User.findById(tokenExist.user)
            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])
            res.send('Cuenta confirmada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static login = async (req : Request, res : Response) => {
        try {
            const {email, password} = req.body
            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('El usuario no existe')
                return res.status(404).json({error : error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                // Enviar el email
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token,
                }) 

                const error = new Error('Tu cuenta no ha sido confirmada, revisa tu correo electrónico.')
                return res.status(401).json({error : error.message})
            }

            // Revisar password
            const isPasswordCorrect = await checkPassword(password, user.password)

            if(!isPasswordCorrect) {
                const error = new Error('El password es incorrecto')
                return res.status(401).json({error : error.message})
            }

            res.send('Login correcto')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static requestConfirmationCode = async (req : Request, res : Response) => {
        try {
            const {email} = req.body

            // Usuario existe
            const user = await User.findOne({email})

            if(!user) {
                const error = new Error('No existe un usuario con este email')
                return res.status(409).json({error : error.message})
            }

            if(user.confirmed) {
                const error = new Error('La cuenta ya ha sido confirmada previemente')
                return res.status(403).json({error : error.message})
            }

            // Generar token
            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            // Enviar el email
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token,
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Revisa tu correo para confirmar tu cuenta')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

}