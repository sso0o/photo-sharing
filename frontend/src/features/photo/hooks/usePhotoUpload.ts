import { useState, useRef } from 'react'
import { getPresignedUrl, uploadToS3 } from '../api/photoService.ts'

export function usePhotoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
    setUploadError(null)
    setUploadSuccess(false)
  }

  async function upload(selectedEventId: string | null): Promise<void> {
    if (!selectedEventId) {
      setUploadError('이벤트를 선택해주세요.')
      return
    }
    if (!file) {
      setUploadError('사진 파일을 선택해주세요.')
      return
    }

    try {
      setUploading(true)
      setUploadError(null)
      setUploadSuccess(false)

      const presignedUrl = await getPresignedUrl()
      await uploadToS3(presignedUrl, file)

      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setUploadSuccess(true)
    } catch {
      setUploadError('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  return {
    fileInputRef,
    file,
    uploading,
    uploadError,
    uploadSuccess,
    handleFileChange,
    upload,
    dismissSuccess: () => setUploadSuccess(false),
  }
}
