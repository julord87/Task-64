import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";


export async function updateProfile(formdata : UserProfileForm) {
    try {
        const {data} = await api.put<string>('/auth/profile', formdata)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function changePasword(formdata : UpdateCurrentUserPasswordForm) {
    try {
        const {data} = await api.post<string>('/auth/update-password', formdata)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}