import { Dispatch, SetStateAction } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ConfirmToken } from '@/types/index';
import { PinInput, PinInputField } from '@chakra-ui/pin-input';
import { Link } from 'react-router-dom';
import { validateToken } from '@/api/AuthAPI';
import { toast } from 'react-toastify';
import '../../utils/custom-toastify.css';

type NewPasswordTokenProps = {
    token: ConfirmToken['token']
    setToken: Dispatch<SetStateAction<string>>
    setIsValidToken: Dispatch<SetStateAction<boolean>>
}

export default function NewPasswordToken({ token, setToken, setIsValidToken }: NewPasswordTokenProps) {

    const { mutate } = useMutation({
        mutationFn: validateToken,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success(data)
            setIsValidToken(true)
        }
    })

    const handleChange = (token: ConfirmToken['token']) => {
        setToken(token)
    }
    const handleComplete = (token: ConfirmToken['token']) => mutate({ token })

    return (
        <>
            <form
                className="space-y-8 p-10 border-2 border-black bg-stone-50 mt-10"
            >
                <label
                    className="font-normal text-2xl text-center block"
                >Código de 6 dígitos</label>
                <div className="flex justify-center gap-3 px-20">
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
                    to='/auth/forgot-password'
                    className="text-center text-gray-300 font-normal hover:text-red-100"
                >
                    Solicitar un nuevo Código
                </Link>
            </nav>
        </>
    )
}