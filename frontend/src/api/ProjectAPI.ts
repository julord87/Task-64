import api from "@/lib/axios"
import { Project, ProjectFormData, dashboardProjectSchema, editProjectSchema, projectSchema } from "../types"
import { isAxiosError } from "axios"

export async function createProject(formData: ProjectFormData) {
    try {
        const {data} = await api.post('/projects', formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}

export async function getProjects() {
    try {
        const {data} = await api.get('/projects')
        const response = dashboardProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}

export async function getProjectById(id : Project['_id']) {
    try {
        const {data} = await api(`/projects/${id}`)
        const response = editProjectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}

export async function getFullProject(id : Project['_id']) {
    try {
        const {data} = await api(`/projects/${id}`)
        const response = projectSchema.safeParse(data)
        if(response.success) {
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}

export async function updateProject({formData, projectId} : ProjectAPIType) {
    try {
        const {data} = await api.put<string>(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}

export async function deletProject(id : Project['_id']) {
    try {
        const {data} = await api.delete<string>(`/projects/${id}`)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
           throw new Error(error.response.data.message)
        }
    }
}