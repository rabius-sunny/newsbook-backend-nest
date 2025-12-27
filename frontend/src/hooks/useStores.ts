'use client'

import { useBlockEditorStore } from '@/stores/block-editor-store'
import { useUploadSessionStore } from '@/stores/upload-session-store'

/**
 * Hook that provides compatibility with the old context API
 * while using the new Zustand stores
 */
export function useBlockEditor() {
  return useBlockEditorStore()
}

/**
 * Hook that provides compatibility with the old upload session context API
 * while using the new Zustand stores
 */
export function useUploadSession() {
  return useUploadSessionStore()
}

/**
 * Utility to clear all stores (useful for testing or admin functions)
 */
export function clearAllStores() {
  useBlockEditorStore.getState().clearBlocks()
  useUploadSessionStore.getState().clearSession()
}
