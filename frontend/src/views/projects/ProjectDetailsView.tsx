import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getFullProject } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/Tasks/AddTaskModal"
import TaskList from "@/components/Tasks/TaskList"
import EditTaskData from "@/components/Tasks/EditTaskData"
import TaskModalDetails from "@/components/Tasks/TaskModalDetails"
import { useAuth } from "@/hooks/useAuth"
import { isManager } from "@/utils/policies"

const ProjectDetailsView = () => {
    
    const { data: user, isLoading: authLoading } = useAuth()
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!
    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getFullProject(projectId),
        retry: false
    })
    if(isLoading && authLoading) return "Cargando..."
    if(isError) return <Navigate to="/404" />
    if(data && user) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            {isManager(data.manager, user._id) && (
                <nav className=" my-5 flex gap-3">
                    <button
                        type="button"
                        className="hover:bg-gray-200 shadow-md border-2 border-black font-bold py-3 px-10 mt-3 cursor-pointer transition-colors"
                        onClick={() => navigate(location.pathname + `?newTask=true`)}
                    >Agregar Tarea</button>

                    <Link
                        className="hover:bg-gray-200 shadow-md border-2 border-black font-bold py-3 px-10 mt-3 cursor-pointer transition-colors"
                        to={'team'}
                    >Colaboradores</Link>

                    <Link
                    className="hover:bg-gray-300 border-2 border-gray-800 font-bold text-gray-800 py-3 px-10 mt-3 cursor-pointer transition-colors shadow-md"
                    to='/'
                    >Volver a proyectos</Link>
                </nav>
            )}

            <TaskList 
                tasks={data.tasks}
                manager={data.manager}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}

export default ProjectDetailsView