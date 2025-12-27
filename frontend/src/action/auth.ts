'use server';

import requests from '@/services/network/http';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
  };
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export const adminAuthenticate = async (email: string, password: string) => {
  const cookieStore = await cookies();

  try {
    const res = await requests.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });

    const authData = res.data;

    // Set access token cookie
    cookieStore.set('adminToken', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authData.expiresIn,
    });

    // Set refresh token cookie (longer expiry)
    cookieStore.set('refreshToken', authData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, user: authData.user };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message ?? 'Invalid credentials',
    );
  }
};

export const getAdminProfile = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await requests.get<ApiResponse<AuthResponse['user']>>(
      '/auth/profile',
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  } catch {
    return null;
  }
};

export const refreshAdminToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!refreshToken) {
    return null;
  }

  try {
    const res = await requests.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      {
        refreshToken,
      },
    );

    const authData = res.data;

    cookieStore.set('adminToken', authData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authData.expiresIn,
    });

    return { success: true };
  } catch {
    // Clear tokens on refresh failure
    cookieStore.delete('adminToken');
    cookieStore.delete('refreshToken');
    return null;
  }
};

export const removeAdminAuthCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('adminToken');
  cookieStore.delete('refreshToken');
};

export const adminLogout = async () => {
  await removeAdminAuthCookie();
  redirect('/admin/login');
};
