import { useState } from "react"
import NewPasswordToken from "@/components/auth/NewPasswordToken"
import NewPasswordForm from "@/components/auth/NewPasswordForm"


export default function NewPasswordView() {
  const [isValidToken, setIsValidToken] = useState(false)

  return (
    <>
      <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el token que recibiste {''}
        <span className=" text-fuchsia-500 font-bold"> a tu correo</span>
      </p>

      {!isValidToken ? <NewPasswordToken /> : <NewPasswordForm />}
    </>


  )
}
