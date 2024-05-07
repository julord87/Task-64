import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import '../../utils/custom-toastify.css';
import ProjectForm from "@/components/projects/ProjectForm"
import { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectAPI"


const CreateProjectView = () => {
    
    const navigate = useNavigate()
    const initialValues : ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    }
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: initialValues})

        const {mutate} = useMutation({
            mutationFn: createProject,
            onSuccess: (data) => {
                toast.success(data)
                navigate('/')
            },
            onError: (error) => {
                toast.error(error.message)
            }
        })

        const handleForm = async (formData : ProjectFormData) => mutate(formData)

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Crear Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>

                <nav className="my-6">
                    <Link
                    className="hover:bg-gray-300 border-2 border-black font-bold py-3 px-10 mt-3 cursor-pointer transition-colors shadow-md"
                    to='/'
                    >Volver a proyectos</Link>
                </nav>

                <form
                    className="bg-stone-50 shadow-md rounded p-10 mt-10 border-2 border-gray-800"
                    onSubmit={handleSubmit(handleForm)}
                    noValidate
                >
                    <ProjectForm 
                        register={register}
                        errors={errors}
                    />

                    <input 
                        type="submit" 
                        value="Crear Proyecto"
                        className="hover:bg-gray-300 border-2 border-black font-bold py-3 px-10 cursor-pointer transition-colors w-full shadow-md"
                    />

                </form>
            </div>
            
        </>
    )
}

export default CreateProjectView