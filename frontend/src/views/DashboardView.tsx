import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/ProjectAPI";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

const DashboardView = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const { data: user, isLoading: authLoading } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading && authLoading) return "Cargando...";

  if(data) return (
    <>
      <h1 className="text-5xl font-black text-gray-800 font-vt323">Mis Proyectos</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Administra tus proyectos
      </p>

      <nav className="my-6">
        <Link
          className="hover:bg-gray-300 border-2 border-gray-800 font-bold text-gray-800 py-3 px-10 mt-3 cursor-pointer transition-colors shadow-md"
          to="projects/create"
        >
          Nuevo Proyecto
        </Link>
      </nav>

      {data?.length ? (
        <ul
          role="list"
          className="divide-y divide-gray-100 border border-gray-100 mt-10 shadow-md"
        >
          {data.map((project) => (
            <li
              key={project._id}
              className="flex justify-between gap-x-6 px-5 py-10 bg-stone-50 border-gray-800 border-2"
            >
              <div className="flex min-w-0 gap-x-4 p-2">
                <div className="min-w-0 flex-auto">
                  <div>
                  {isManager(project.manager, user!._id) ?
                    <p className="font-bold text-xs uppercase bg-red-50 text-gray-500 border-2 inline-block py-1 px-5 mb-2">Manager</p> :
                    <p className="font-bold text-xs uppercase text-gray-500 border-2 inline-block py-1 px-5 mb-2">Colaborador</p>
                  }
                  </div>
                  <div className="mb-2">
                    <Link
                      to={`projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>
                  </div>
                  <p className="text-gray-400">
                    Cliente: {project.clientName}
                  </p>
                  <p className="text-gray-400">{project.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-6">
                <Menu as="div" className="relative flex-none">
                  <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                    <span className="sr-only">opciones</span>
                    <EllipsisVerticalIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right border-2 border-gray-800 bg-red-50 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <Menu.Item>
                        <Link
                          to={`/projects/${project._id}`}
                          className="block px-3 py-1 text-sm leading-6 text-gray-900"
                        >
                          Ver Proyecto
                        </Link>
                      </Menu.Item>

                      {isManager(project.manager, user!._id) && (
                        <>
                          <Menu.Item>
                            <Link
                              to={`/projects/${project._id}/edit`}
                              className="block px-3 py-1 text-sm leading-6 text-gray-900"
                            >
                              Editar Proyecto
                            </Link>
                          </Menu.Item>
                          <Menu.Item>
                            <button
                              type="button"
                              className="block px-3 py-1 text-sm leading-6 text-gray-400"
                              onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                            >
                              Eliminar Proyecto
                            </button>
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-20">
          No hay proyectos aún {""}
          <Link to="/projects/create" className=" text-black font-bold">
            Crear Proyecto
          </Link>
        </p>
      )}

      <DeleteProjectModal />
    </>
  );
};

export default DashboardView;
