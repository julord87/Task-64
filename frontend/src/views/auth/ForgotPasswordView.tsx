import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "react-toastify";
import '../../utils/custom-toastify.css';
import { resetPassword } from "@/api/AuthAPI";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  const { mutate } = useMutation({
    mutationFn: resetPassword,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      reset()
    }
  })

  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)


  return (
    <>
        <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
        <p className="text-2xl font-light text-red-50 mt-5">
            ¿Olvidaste tu Password? Coloca tu correo y recibe instrucciones</p>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10 mt-10  bg-stone-50 border-2 border-black"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
            htmlFor="email"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border focus:border-red-600"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Enviar Instrucciones'
          className="shadow-md bg-stone-50 hover:bg-gray-200 w-full p-3 border-2 border-gray-800 text-gray-600 font-black  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/login'
          className="text-center text-gray-300 font-normal hover:text-red-100"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        <Link
          to='/auth/register'
          className="text-center text-gray-300 font-normal hover:text-red-100"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  )
}