import type { Request, Response } from "express";
import User from "../models/User";
import { hashPassword } from "../utils/auth";
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

}