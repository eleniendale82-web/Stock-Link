import { getPublicProductById } from '@/features/products/product-details.service'
import { productIdSchema } from '@/features/products/products.schema'
import { ApiError, handleApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'

type RouteContext = { params: { id: string } }

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const parsedId = productIdSchema.safeParse(params.id)
    if (!parsedId.success) {
      throw new ApiError('Product ID must be a valid UUID', 400, 'INVALID_PRODUCT_ID')
    }

    const product = await getPublicProductById(parsedId.data)
    if (!product) throw new ApiError('Product not found', 404, 'PRODUCT_NOT_FOUND')

    return successResponse(product, 200, 'Product retrieved successfully')
  } catch (error) {
    return handleApiError(error)
  }
}
