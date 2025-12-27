import axios from 'axios'

export const baseURL = process.env.NEXT_PUBLIC_APP_ROOT_API

const axiosinstance = axios.create({
  baseURL,
  xsrfCookieName: '',
  xsrfHeaderName: '',
  timeout: 30000,
  withCredentials: true,
})

export default axiosinstance
