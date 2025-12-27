'use client'

import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: Date
}

interface UploadSessionState {
  sessionImages: SessionImage[]
  isUploading: boolean
  sessionId: string

  // Actions
  uploadImages: (files: File[]) => Promise<SessionImage[]>
  removeSessionImage: (id: string) => void
  clearSession: () => void
  setUploading: (uploading: boolean) => void
  createNewSession: () => void
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const useUploadSessionStore = create<UploadSessionState>()(
  persist(
    (set) => ({
      sessionImages: [],
      isUploading: false,
      sessionId: generateRandomString(16),

      uploadImages: async (files: File[]): Promise<SessionImage[]> => {
        set({ isUploading: true })
        try {
          const formData = new FormData()
          files.forEach((file) => {
            formData.append('images[]', file)
          })

          const response = await requests.post('/gallery/upload', formData)

          if (!response.success || !response.data) {
            throw new Error('Upload failed')
          }

          // Create session image objects
          const newSessionImages: SessionImage[] = response.data.uploadedUrls.map(
            (url: string, index: number) => ({
              id: Math.random().toString(36).substring(2, 15),
              url,
              name: files[index]?.name || `Image ${index + 1}`,
              size: files[index]?.size || 0,
              uploadedAt: new Date(),
            }),
          )

          // Add to session
          set((state) => ({
            sessionImages: [...state.sessionImages, ...newSessionImages],
          }))

          return newSessionImages
        } catch (error) {
          showError(error)
          throw error
        } finally {
          set({ isUploading: false })
        }
      },

      removeSessionImage: (id: string) => {
        set((state) => ({
          sessionImages: state.sessionImages.filter((img) => img.id !== id),
        }))
      },

      clearSession: () => {
        set({
          sessionImages: [],
          sessionId: generateRandomString(16),
        })
      },

      setUploading: (uploading: boolean) => {
        set({ isUploading: uploading })
      },

      createNewSession: () => {
        set({
          sessionId: generateRandomString(16),
          sessionImages: [],
          isUploading: false,
        })
      },
    }),
    {
      name: 'newsbook-upload-session',
      storage: {
        getItem: (name) => {
          const value = sessionStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name)
        },
      },
    },
  ),
)
