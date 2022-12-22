import axios from "axios"
import nookies from "nookies"
import urls from "../urls"

const myAxios = axios.create()
myAxios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

myAxios.interceptors.request.use((config) => {
  const userStr = nookies.get(null).user

  if (userStr && config.headers)
    config.headers["x-auth-token"] = JSON.parse(userStr).token
  return config
})

myAxios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // unauthenticated -> go to "/"
    if (error?.response?.status === 401 && window) window.location.href = urls.pages.index
    return Promise.reject(error)
  }
)

export default myAxios
