import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user? : IUser
        }
    }
}

export const authenticate = async (req : Request, res : Response, next : NextFunction) => {
    
    const bearer = req.headers.authorization
    if(!bearer || !bearer.startsWith('Bearer ')) {
        const error = new Error('Credenciales inválidas')
        return res.status(401).json({error : error.message})
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById((decoded as {id : string}).id).select('_id name email')
        
        if(user) {
            req.user = user
            next()
        } else {
            return res.status(500).json({error : 'Token no válido'})
        }
    } catch (error) {
        res.status(500).json({error : 'Token no válido'})
    }
}