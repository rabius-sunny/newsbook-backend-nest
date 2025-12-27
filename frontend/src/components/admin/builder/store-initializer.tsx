'use client'

import { showError } from '@/lib/errMsg'
import { useBlockEditorStore } from '@/stores/block-editor-store'
import { useUploadSessionStore } from '@/stores/upload-session-store'
import { useEffect } from 'react'

interface StoreInitializerProps {
  children: React.ReactNode
}

export function StoreInitializer({ children }: StoreInitializerProps) {
  const { createNewSession: createBlockSession } = useBlockEditorStore()
  const { createNewSession: createUploadSession } = useUploadSessionStore()

  useEffect(() => {
    // Initialize stores on client side
    if (typeof window !== 'undefined') {
      // Create new sessions if needed
      try {
        // These will load from sessionStorage if available
        // or create new sessions if not
      } catch (error) {
        showError(error)
        // If there's an error loading from session storage, create new sessions
        createBlockSession()
        createUploadSession()
      }
    }
  }, [createBlockSession, createUploadSession])

  return <>{children}</>
}
