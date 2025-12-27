'use server'

import requests from '@/services/network/http'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'

export const adminAuthenticate = async (field: string, password: string) => {
  const cookieStore = await cookies()

  try {
    const res = await requests.post('/auth/admin/sign-in', { field, password })

    cookieStore.set('adminToken', res?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return res
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>
    throw new Error(axiosError.response?.data?.message ?? 'Invalid credentials')
  }
}

export const removeAdminAuthCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('adminToken')
  cookieStore.delete('superAdminToken')
}

// Client-side authentication function
export const authenticateAdmin = async (field: string, password: string) => {
  try {
    const response = await fetch('/api/auth/admin/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Authentication failed')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}
