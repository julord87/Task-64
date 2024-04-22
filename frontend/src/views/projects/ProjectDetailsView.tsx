import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/api/ProjectAPI"
import AddTaskModal from "@/components/Tasks/AddTaskModal"
import TaskList from "@/components/Tasks/TaskList"
import EditTaskData from "@/components/Tasks/EditTaskData"
import TaskModalDetails from "@/components/Tasks/TaskModalDetails"

const ProjectDetailsView = () => {
    
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!
    const { data, isLoading, isError } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getProjectById(projectId),
        retry: false
    })
    if(isLoading) return "Cargando..."
    if(isError) return <Navigate to="/404" />
    if(data) return (
        <>
            <h1 className="text-5xl font-black">{data.projectName}</h1>
            <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

            <nav className=" my-5 flex gap-3">
                <button
                    type="button"
                    className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-3 px-10  cursor-pointer transition-colors"
                    onClick={() => navigate(location.pathname + `?newTask=true`)}
                >Agregar Tarea</button>
            </nav>
            <TaskList 
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData />
            <TaskModalDetails />
        </>
    )
}

export default ProjectDetailsView