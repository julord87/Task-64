import Logo from "@/components/Logo"
import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

const AuthLayout = () => {
  return (
    <>
        <div className="bg-gray-800 min-h-screen">
            <div className="py-10 lg:py-20 mx-auto w-[70%] lg:w-[19%]">
                <Logo />
                <div className="mt-10">
                    <Outlet />
                </div>
            </div>
        </div>

        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  )
}

export default AuthLayout