import { getProducts } from '@/features/products/products.service'
import { parseProductQuery } from '@/features/products/products.schema'
import { handleApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const query = parseProductQuery(request.nextUrl.searchParams)
    const result = await getProducts(query)
    return successResponse(
      result.products,
      200,
      'Products retrieved successfully',
      { pagination: result.pagination }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
