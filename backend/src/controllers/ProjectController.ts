import type { Request, Response } from "express"
import Project from "../models/Project"

export class ProjectController {

    static createProject = async (req : Request, res : Response) => {
        const project = new Project(req.body)

        // Asigna un manager
        project.manager = req.user.id
        
        try {
            await project.save()
            res.send('Proyecto creado correctamente') 

        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req : Request, res : Response) => {
        try {
            const projects = await Project.find({
                $or : [
                    {manager : {$in : [req.user.id]}},
                    {team : {$in : [req.user.id]}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req : Request, res : Response) => {
        const {id} = req.params
        try {
            const project = await Project.findById(id).populate('tasks')
            
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error : error.message})
            } 

            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                const error = new Error('Acción no válida')
                return res.status(404).json({error : error.message})
            }

            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req : Request, res : Response) => {
        const {id} = req.params
        try {
            const project = await Project.findById(id)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error : error.message})
            }

            if(project.manager.toString() !== req.user.id) {
                const error = new Error('Solo el Manager del proyecto puede actualizarlo')
                return res.status(404).json({error : error.message})
            }
            
            project.clientName = req.body.clientName
            project.description = req.body.description
            project.projectName = req.body.projectName

            await project.save()
            res.send('Proyecto actualizado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req : Request, res : Response) => {
        const {id} = req.params
        try {
            const project = await Project.findByIdAndDelete(id)
            if(!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error : error.message})
            }

            if(project.manager.toString() !== req.user.id) {
                const error = new Error('Solo el Manager del proyecto puede eliminarlo')
                return res.status(404).json({error : error.message})
            }

            res.send('Proyecto eliminado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

}