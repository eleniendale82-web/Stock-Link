import { getPublicCategories } from '@/features/categories/categories.service'
import { handleApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const categories = await getPublicCategories()
    return successResponse(categories, 200, 'Categories retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}
