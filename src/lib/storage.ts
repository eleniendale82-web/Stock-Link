// Storage utility — configure with your provider (S3, Cloudinary, etc.)
export async function uploadFile(file: File, path: string): Promise<string> {
  throw new Error('Storage provider not configured')
}

export async function deleteFile(url: string): Promise<void> {
  throw new Error('Storage provider not configured')
}
