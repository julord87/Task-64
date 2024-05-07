import { useForm } from "react-hook-form"
import ProjectForm from "@/components/projects/ProjectForm"
import { Link, useNavigate } from "react-router-dom"
import { Project, ProjectFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"
import '../../utils/custom-toastify.css';

type EditProjectFormProps = {
    data: ProjectFormData
    projectId: Project['_id']
}

const EditProjectForm = ({data, projectId} : EditProjectFormProps) => {

    const navigate = useNavigate()
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }})

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ["editProject", projectId]})

            toast.success(data)
            navigate('/')
        }
    })

    const handleForm = (formData : ProjectFormData) => {
        const data = {
            projectId,
            formData
        }
        mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link
                    className="hover:bg-gray-300 border-2 border-gray-800 font-bold text-gray-800 py-3 px-10 mt-3 cursor-pointer transition-colors shadow-md"
                    to='/'
                    >Volver a proyectos</Link>
                </nav>

                <form
                    className="bg-stone-50 border-2 border-gray-800 shadow-md p-10 mt-10 rounded"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />

                    <input 
                        type="submit" 
                        value="Guardar Cambios"
                        className="hover:bg-gray-300 border-2 border-gray-800 font-bold text-gray-800 py-3 px-10 mt-3 cursor-pointer transition-colors shadow-md w-full"
                    />

                </form>
            </div>
            
        </>
    )
}

export default EditProjectForm