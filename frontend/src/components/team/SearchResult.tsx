import { useMutation, useQueryClient } from "@tanstack/react-query"
import { TeamMember } from "@/types/index"
import { addUserToProject } from "@/api/TeamAPI"
import { toast } from "react-toastify"
import '../../utils/custom-toastify.css';
import { useNavigate, useParams } from "react-router-dom"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}

export default function SearchResult({user, reset}: SearchResultProps) {

    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()
    const {mutate} = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
            queryClient.invalidateQueries({queryKey: ["projectTeam", projectId]})
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

  return (
    <>
        <p className="mt-10 text-left font-bold">Resultado:</p>
        <div className="flex justify-between items-center mt-4">
            <p>{user.name}</p>
            <button 
                className="border-black border-2 px-10 py-2 cursor-pointer hover:bg-gray-100 font-bold"
                onClick={handleAddUserToProject}
            >Agregar al Proyecto</button>
        </div>
    </>
  )
}
