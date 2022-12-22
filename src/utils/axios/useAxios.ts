import { ValidationError } from "class-validator"
import nookies from "nookies"

import useSnackbarStore from "@/hooks/zustand/useSnackbarStore"
import axios from "axios"
import urls from "../urls"

export const useAxios = (params?: { redirectOn401?: boolean }) => {
  const localAxios = axios.create()
  localAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

  const setErrorMessage = useSnackbarStore((s) => s.setErrorMessage)

  localAxios.interceptors.request.use(async (config) => {
    const userStr = nookies.get(null).user

    if (userStr && config.headers)
      config.headers["x-auth-token"] = JSON.parse(userStr).token
    return config
  })

  localAxios.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // unauthenticated -> go to "/"
      if (error?.response?.status === 401 && window)
        window.location.href = urls.pages.index

      if (axios.isAxiosError<{ errors: ValidationError[]; message: string }>(error)) {
        const constraints = error.response?.data?.errors?.[0].constraints
        if (constraints) {
          const [key, value] = Object.entries(constraints)[0]

          setErrorMessage(value)

          return Promise.reject(error)
        }

        setErrorMessage(error.response?.data.message || error.message)
      }

      return Promise.reject(error)
    }
  )

  return localAxios
}
