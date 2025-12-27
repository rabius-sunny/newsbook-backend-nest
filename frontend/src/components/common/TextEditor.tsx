'use client'

import dynamic from 'next/dynamic'
import { useRef, forwardRef } from 'react'

// Dynamically import Jodit (disable SSR)
const JoditEditor = dynamic(() => import('jodit-react'), {
 ssr: false,
})

interface TextEditorProps {
 value: string
 onChange: (value: string) => void
 buttons?: string[]
 placeholder?: string
 height?: number | string
}
  interface JoditConfig {
    height: number | string
    processPasteHTML: boolean
    askBeforePasteHTML: boolean
    defaultActionOnPaste: string
    readonly: boolean
    uploader: {
      insertImageAsBase64URI: boolean
      imagesExtensions: string[]
    }
  }
const TextEditor = forwardRef<any, TextEditorProps>(
 (
  { value, onChange, height = 400 },
  ref,
 ) => {
  const editorRef = useRef(null)



  // Config function
  const getConfig = (): JoditConfig => {
   return {
    height,
    processPasteHTML: true,
    askBeforePasteHTML: false,
    defaultActionOnPaste: 'insert_as_html',
    readonly: false,
    uploader: {
     insertImageAsBase64URI: true,
     imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
    },
   }
  }

  return (
   <JoditEditor
    ref={ref || editorRef}
    value={value}
    config={getConfig() as any}
    onBlur={(newContent) => onChange(newContent)}
    onChange={(newContent) => onChange(newContent)}
   />
  )
 },
)

TextEditor.displayName = 'TextEditor'

export default TextEditor
