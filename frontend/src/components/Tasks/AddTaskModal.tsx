import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import TaskForm from "./TaskForm";
import { TaskFormData } from "@/types/index";
import { createTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import '../../utils/custom-toastify.css';

export default function AddTaskModal() {

    const navigate = useNavigate()

    /** Leer si modal exite */
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    /** Obtener projectId */
    const params = useParams()
    const projectId = params.projectId!

    const initialValues : TaskFormData = {
        name: "",
        description: ""
    }
    const { register, handleSubmit, formState: {errors}, reset } = useForm({defaultValues: initialValues})

    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createTask,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['project', projectId]})
            toast.success(data)
            reset()
            navigate(location.pathname, {replace: true})
        }
    })

    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            projectId,
            formData
        }
        mutate(data)
    }
  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, {replace: true})}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden border-2 shadow-md border-gray-800 bg-stone-50 text-left align-middle shadow-xl transition-all p-16">
                  <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold mb-8">
                    Llena el formulario y crea una tarea
                  </p>

                  <form
                    className=" mt10 space-y-3 focus:border-gray-500"
                    onSubmit={handleSubmit(handleCreateTask)}
                    noValidate
                  >
                    <TaskForm 
                        register={register}
                        errors={errors}
                    />
                    <input 
                        type="submit" 
                        className="hover:bg-gray-200 border-2 border-black font-bold py-3 px-10 mt-3 cursor-pointer transition-colors w-full shadow-md"
                        value="Crear Tarea"
                    />
                  </form>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
