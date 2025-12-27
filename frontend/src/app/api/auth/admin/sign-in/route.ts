import requests from '@/services/network/http'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { field, password } = body

    if (!field || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    // Make request to backend API
    const res = await requests.post('/auth/admin/sign-in', { field, password })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('adminToken', res?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json(res)
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>
    const message = axiosError.response?.data?.message ?? 'Invalid credentials'

    return NextResponse.json({ message }, { status: axiosError.response?.status || 401 })
  }
}
