import { showError } from '@/lib/errMsg'
import {
  FileType,
  UploadOptions,
  convertToFileList,
  generateFilePreview,
  initialUploadState,
  processFileUpload,
  updateFileListWithPreviews,
  updateFileListWithUrls,
} from '@/lib/uploader'
import { useEffect, useRef, useState } from 'react'

export interface UseImageUploaderProps extends UploadOptions {
  value?: string | string[]
  onChange?: (url: string | string[]) => void
}

export const useImageUploader = ({
  value,
  onChange,
  multiple = false,
  ...options
}: UseImageUploaderProps) => {
  const [fileLists, setFileLists] = useState<FileType[]>([])
  const [uploadState, setUploadState] = useState(initialUploadState)
  const uploadInProgress = useRef(false)

  useEffect(() => {
    setFileLists(convertToFileList(value))
  }, [value])

  const handleChange = async ({ fileList }: { fileList: FileType[] }) => {
    const updatedList = updateFileListWithPreviews(fileList)
    setFileLists(updatedList)

    if (uploadInProgress.current) return

    uploadInProgress.current = true
    setUploadState((prev) => ({ ...prev, isUploading: true }))

    try {
      await processFileUpload(updatedList, options, (urls) => {
        onChange?.(multiple ? urls : urls[0])

        setFileLists((prev) => updateFileListWithUrls(prev, urls, multiple))
      })
    } catch (error) {
      showError(error)
    } finally {
      uploadInProgress.current = false
      setUploadState((prev) => ({ ...prev, isUploading: false }))
    }
  }

  const onPreview = async (file: any) => {
    const previewUrl = await generateFilePreview(file)
    setUploadState((prev) => ({
      ...prev,
      previewImage: previewUrl,
      previewOpen: true,
    }))
  }

  const closePreview = () => {
    setUploadState((prev) => ({
      ...prev,
      previewOpen: false,
      previewImage: '',
    }))
  }

  return {
    fileLists,
    uploadState,
    handleChange,
    onPreview,
    closePreview,
  }
}
