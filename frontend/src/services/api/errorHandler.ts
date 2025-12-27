import { AxiosError } from 'axios'
import { clearSession } from './authUtils'

export const handleApiError = (error: AxiosError<{ message?: string }>) => {
  if (error.response?.status === 401) {
    console.error('Session expired. Please log in again.')
    clearSession()
  } else if (error.response?.status === 403) {
    console.error('You do not have permission to perform this action.')
  } else if (error.response?.status === 500) {
    console.error('Server error. Please try again later.')
  } else {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.'
    console.log(errorMessage)
  }
}

// export const handleApiError = (error: AxiosError) => {
//   const status = error.response?.status

//   // Define the error messages based on status codes
//   const errorMessages = {
//     401: 'Session expired. Please log in again.',
//     403: 'You do not have permission to perform this action.',
//     500: 'Server error. Please try again later.',
//     default:
//       (error.response?.data as { message?: string })?.message || 'An unexpected error occurred.'
//   }

//   // Handle different error status codes with appropriate error messages
//   switch (status) {
//     case 401:
//       console.error('Session expired. Please log in again.')
//       clearSession()
//       break
//     case 403:
//       console.error('You do not have permission to perform this action.')
//       break
//     case 500:
//       console.error('Server error. Please try again later.')
//       break
//     default:
//       console.error('An unexpected error occurred.')
//   }
// }
