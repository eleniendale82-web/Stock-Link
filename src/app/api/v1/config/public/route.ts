import { getPublicConfig } from '@/features/config/config.service'
import { handleApiError } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'

export const dynamic = 'force-dynamic'

export function GET() {
  try {
    return successResponse(
      getPublicConfig(),
      200,
      'Public configuration retrieved successfully',
      null,
      { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=60' }
    )
  } catch (error) {
    return handleApiError(error, { 'Cache-Control': 'no-store' })
  }
}
