import client from '../../../api/client.ts'

export async function getPresignedUrl(): Promise<string> {
  const { data } = await client.get<{ presignedUrl: string }>('/photos/presigned-url')
  return data.presignedUrl
}

// S3는 외부 URL이므로 내부 client를 사용하지 않고 bare fetch로 업로드한다
export async function uploadToS3(presignedUrl: string, file: File): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!response.ok) throw new Error('S3 업로드에 실패했습니다.')
}
