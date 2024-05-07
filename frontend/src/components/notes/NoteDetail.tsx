import { deleteNote } from "@/api/NoteAPI"
import { useAuth } from "@/hooks/useAuth"
import { Note } from "@/types/index"
import { formatDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import '../../utils/custom-toastify.css';


type NoteDetailprops = {
    note: Note
}

export default function NoteDetail({note} : NoteDetailprops) {

    const { data, isLoading } = useAuth()
    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data, note])
    const params = useParams()
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const projectId = params.projectId!

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => toast.error(error.message),
        onSuccess: (data) => {
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['task', taskId]})
        }
    })

    if(isLoading) return "Cargando..."

  return (
    <div className="p-3 flex justify-between items-center">
        <div>
            <p>
                {`"${note.content}"`} <span className="text-slate-500">por: </span><span className="font-bold">{note.createdBy.name}</span>
            </p>
            <p className="text-xs text-slate-500">
                {formatDate(note.createdAt)}
            </p>
        </div>

        {canDelete && (
            <button
                type="button"
                className="text-gray-500 hover:text-gray-800 "
                onClick={() => mutate({noteId: note._id, projectId, taskId})}
            >
                x
            </button>
        )}
    </div>
  )
}
