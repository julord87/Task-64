import { Request, Response } from "express"
import User from "../models/User"
import Project from "../models/Project"

export class TeamMemberController {
    static findMemberByEmail = async (req: Request, res: Response) => {
        const { email } = req.body

        // Find user
        const user = await User.findOne({ email }).select('_id name email')
        if(!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error : error.message})
        }

        res.json(user)
    }

    static getProjectTeam = async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({path : 'team', select : 'id name email'})

        res.json(project.team)
    }

    static addMemberById = async (req: Request, res: Response) => {
        const { id } = req.body
    
        // Find user
        const user = await User.findById(id).select('id')
        if(!user) {
            const error = new Error('Usuario no encontrado')
            return res.status(404).json({error : error.message})
        }

        if(req.project.team.some(team => team.toString() === user.id.toString())) {
            const error = new Error('El usuario ya pertenece al equipo')
            return res.status(409).json({error : error.message})
        }

        req.project.team.push(user.id)
        await req.project.save()

        res.json('Usuario agregado correctamente')
    }

    static removeMemberById = async (req: Request, res: Response) => {
        const { userId } = req.params

        if(!req.project.team.includes(userId)) {
            const error = new Error('El usuario no pertenece al equipo')
            return res.status(409).json({error : error.message})
        }
    
        req.project.team = req.project.team.filter(teammember => teammember.toString() !== userId)
        await req.project.save()

        res.send('Usuario eliminado correctamente')
    }
}