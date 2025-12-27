import requests from '@/services/network/http'
import Cookies from 'js-cookie'
import { toast } from 'sonner'
import { showError } from './errMsg'

export type RcFile = File & {
  uid?: string
}

export type FileType = {
  preview: any
  originFileObj: any
  uid: string
  name: string
  status: 'uploading' | 'done' | 'error' | 'removed'
  url?: string
  response?: any
}

export const convertToFileList = (urls: string | string[] | undefined): FileType[] => {
  const list = Array.isArray(urls) ? urls : urls ? [urls] : []
  return list.map((url, i) => ({
    uid: `${i}`,
    name: `image-${i}.png`,
    status: 'done',
    url,
    preview: url,
    originFileObj: null,
    response: undefined,
  }))
}

export const beforeCrop = (targetAspect: number) => {
  return async (file: RcFile) => {
    const image = await getImageDimensions(file)
    const imgRatio = image.width / image.height
    const isSameRatio = Math.abs(imgRatio - targetAspect) < 0.01
    return !isSameRatio // ⛔ Skip cropping if already same aspect
  }
}

// helper to get image dimensions
const getImageDimensions = (file: RcFile): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = URL.createObjectURL(file)
  })
}

// export const getBase64 = (file: FileType): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file as any)
//     reader.onload = () => resolve(reader.result as string)
//     reader.onerror = (error) => reject(error)
//   })

export interface UploadOptions {
  isCustomer?: boolean
  existing?: string[]
  deletes?: string[]
  multiple?: boolean
  maxAllow?: number
}

// File validation utilities
export const validateFile = (file: RcFile): boolean => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/x-icon',
    'image/vnd.microsoft.icon',
  ]

  if (!allowedTypes.includes(file.type)) {
    toast.error('Unsupported file type')
    return false
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File too large (Max 5MB)')
    return false
  }

  return true
}

export const validateFiles = (files: FileType[]): FileType[] => {
  return files.filter((file) => {
    if (!file.originFileObj) return false
    return validateFile(file.originFileObj)
  })
}

// File conversion utilities
// export const convertToFileList = (value?: string | string[]): FileType[] => {
//   if (!value) return []

//   const urls = Array.isArray(value) ? value : [value]
//   return urls.map((url, index) => ({
//     uid: `existing-${index}`,
//     name: `image-${index}.png`,
//     status: 'done' as const,
//     url
//   }))
// }

export const createFilePreview = (file: FileType): FileType => {
  if (!file.url && !file.preview && file.originFileObj) {
    return {
      ...file,
      preview: URL.createObjectURL(file.originFileObj as Blob),
    }
  }
  return file
}

export const updateFileListWithPreviews = (fileList: FileType[]): FileType[] => {
  return fileList.map(createFilePreview)
}

// FormData creation utilities
export const createUploadFormData = (
  files: FileType[],
  existing: string[] = [],
  deletes: string[] = [],
): FormData => {
  const formData = new FormData()

  files.forEach((file) => {
    if (file.originFileObj) {
      formData.append('images[]', file.originFileObj as File)
    }
  })

  existing.filter(Boolean).forEach((url) => formData.append('existing', url))
  deletes.filter(Boolean).forEach((url) => formData.append('deletes', url))

  return formData
}

// Preview utilities
export const getBase64 = (file: RcFile): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export const generateFilePreview = async (file: FileType): Promise<string> => {
  if (file.url) return file.url
  if (file.preview) return file.preview
  if (file.originFileObj) {
    return await getBase64(file.originFileObj as RcFile)
  }
  return ''
}

// Upload API utilities
export const uploadImages = async (
  formData: FormData,
  options: UploadOptions,
): Promise<string[]> => {
  const token = Cookies.get('token')

  const response = await requests.post(
    options.isCustomer ? '/upload/image' : '/gallery/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(options.isCustomer ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  )

  const urls = response?.data?.uploadedUrls
  if (!urls || (Array.isArray(urls) && urls.length === 0)) {
    throw new Error('No image URL returned')
  }

  return Array.isArray(urls) ? urls : [urls]
}

// File list management utilities
export const updateFileListWithUrls = (
  fileList: FileType[],
  urls: string[],
  multiple: boolean,
): FileType[] => {
  const urlsCopy = [...urls]

  const updated = fileList.map((file) => {
    if (file.originFileObj && !file.url) {
      const newUrl = urlsCopy.shift()
      if (!newUrl) return file
      return {
        ...file,
        status: 'done' as const,
        url: newUrl,
      }
    }
    return file
  })

  if (multiple && urlsCopy.length > 0) {
    const extras = urlsCopy.map((url, i) => ({
      uid: `uploaded-extra-${i}`,
      name: `image-extra-${i}.png`,
      status: 'done' as const,
      url,
      preview: url,
      originFileObj: null,
      response: undefined,
    }))
    return [...updated, ...extras]
  }

  return updated
}

export const getNewFiles = (fileList: FileType[]): FileType[] => {
  return fileList.filter((file) => file.originFileObj && !file.url)
}

export const shouldAllowMoreUploads = (
  fileList: FileType[],
  multiple: boolean,
  maxAllow: number,
): boolean => {
  return fileList.length < (multiple ? maxAllow : 1)
}

// Upload process utilities
export const processFileUpload = async (
  fileList: FileType[],
  options: UploadOptions,
  onSuccess: (urls: string[]) => void,
): Promise<void> => {
  const newFiles = getNewFiles(fileList)
  if (!newFiles.length) return

  const validFiles = validateFiles(newFiles)
  if (!validFiles.length) return

  const formData = createUploadFormData(validFiles, options.existing, options.deletes)

  try {
    const urls = await uploadImages(formData, options)
    toast.success('Upload successful')
    onSuccess(urls)
  } catch (error) {
    showError(error)
  }
}

// URL extraction utilities
export const extractUrlsFromFileList = (fileList: FileType[]): string[] => {
  return fileList.filter((file) => file.url).map((file) => file.url!)
}

export const extractSingleUrl = (fileList: FileType[]): string | undefined => {
  const urls = extractUrlsFromFileList(fileList)
  return urls[0]
}

// Upload configuration utilities
export const createUploadProps = (fileList: FileType[], multiple: boolean, maxAllow: number) => ({
  listType: 'picture-card' as const,
  fileList,
  multiple,
  beforeUpload: () => true,
  maxCount: multiple ? maxAllow : 1,
  showUploadList: true,
  accept: 'image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon',
})

// Upload state management
export interface UploadState {
  isUploading: boolean
  uploadInProgress: boolean
  previewOpen: boolean
  previewImage: string
}

export const initialUploadState: UploadState = {
  isUploading: false,
  uploadInProgress: false,
  previewOpen: false,
  previewImage: '',
}

export const setUploadInProgress = (inProgress: boolean) => {
  // This would be managed by the custom hook
  return { uploadInProgress: inProgress, isUploading: inProgress }
}
