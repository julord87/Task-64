import { NoteFormData } from "@/types/index"
import { useForm } from "react-hook-form"
import ErrorMessage from "../ErrorMessage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/api/NoteAPI"
import { toast } from "react-toastify"
import '../../utils/custom-toastify.css';
import { useLocation, useParams } from "react-router-dom"
export default function AddNoteForm() {

    const params = useParams()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)

    const projectId = params.projectId!
    const taskId = queryParams.get('viewTask')!

    const initialValues : NoteFormData = {
        content: ''
    }

    const { register, handleSubmit, formState: { errors }} = useForm({
        defaultValues: initialValues
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    const handleAddNote = (formData: NoteFormData) => {
        mutate({projectId, taskId, formData})
    }

  return (
    <form
        onSubmit={handleSubmit(handleAddNote)}
        className="space-y-3"
        noValidate
    >
        <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="content">Crear Nota</label>
            <input 
                id="content"
                type="text" 
                placeholder="Contenido de la nota"
                className="w-full p-3 border border-gray-300 focus:border-red-500 bg-stone-50"
                {...register("content", {
                    required: "El contenido de la nota es obligatorio",
                })}
            />
            {errors.content && <ErrorMessage>{errors.content.message}</ErrorMessage>}
        </div>

        <input 
            type="submit"
            value="Crear Nota" 
            className="border-2 border-black p-2 w-full hover:bg-gray-200 shadow-md cursor-pointer"
        />
    </form>
  )
}
