import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import '../../utils/custom-toastify.css';

export default function ConfirmAccountView() {
    const [token, setToken] = useState<ConfirmToken['token']>('')

    const {mutate} = useMutation({
        mutationFn: confirmAccount,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }

    const handleComplete = (token: ConfirmToken['token']) => mutate({token})

  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-red-50 mt-5">
        Ingresa el código que recibiste por e-mail</p>
      <form
        className="space-y-8 p-10 bg-white mt-10 border-2 border-black"
      >
        <label
          className="font-normal text-2xl text-center block"
        >Código de 6 dígitos</label>
        <div className="flex justify-center gap-3">
            <PinInput value={token} onChange={handleChange} onComplete={handleComplete}>
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
              <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white shadow-md focus:border-red-500" />
            </PinInput>
        </div>

      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to='/auth/request-code'
          className="text-center text-gray-300 font-normal hover:text-red-100"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>

    </>
  )
}