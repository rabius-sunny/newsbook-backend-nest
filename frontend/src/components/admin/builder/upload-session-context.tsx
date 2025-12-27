'use client'

import { showError } from '@/lib/errMsg'
import requests from '@/services/network/http'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export interface SessionImage {
  id: string
  url: string
  name: string
  size: number
  uploadedAt: Date
}

interface UploadSessionContextType {
  sessionImages: SessionImage[]
  uploadImages: (files: File[]) => Promise<SessionImage[]>
  isUploading: boolean
  removeSessionImage: (id: string) => void
  clearSession: () => void
}

const UploadSessionContext = createContext<UploadSessionContextType | null>(null)

interface UploadSessionProviderProps {
  children: ReactNode
}

export function UploadSessionProvider({ children }: UploadSessionProviderProps) {
  const [sessionImages, setSessionImages] = useState<SessionImage[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const uploadImages = useCallback(async (files: File[]): Promise<SessionImage[]> => {
    setIsUploading(true)
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
          uploadedAt: new Date()
        })
      )

      // Add to session
      setSessionImages((prev) => [...prev, ...newSessionImages])

      return newSessionImages
    } catch (error) {
      showError(error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [])

  const removeSessionImage = useCallback((id: string) => {
    setSessionImages((prev) => prev.filter((img) => img.id !== id))
  }, [])

  const clearSession = useCallback(() => {
    setSessionImages([])
  }, [])

  const value: UploadSessionContextType = {
    sessionImages,
    uploadImages,
    isUploading,
    removeSessionImage,
    clearSession
  }

  return <UploadSessionContext.Provider value={value}>{children}</UploadSessionContext.Provider>
}

// Hook to use the upload session context
export function useUploadSession() {
  const context = useContext(UploadSessionContext)
  if (!context) {
    throw new Error('useUploadSession must be used within an UploadSessionProvider')
  }
  return context
}
