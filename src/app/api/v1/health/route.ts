import { getHealthStatus } from '@/features/health/health.service'
import { errorResponse } from '@/lib/api-error'
import { successResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const result = await getHealthStatus()

    if (!result.healthy) {
      return errorResponse(
        'A critical dependency is unavailable',
        503,
        'SERVICE_UNAVAILABLE',
        undefined,
        undefined,
        result.data
      )
    }

    return successResponse(result.data, 200, 'Health check passed')
  } catch {
    return errorResponse('Health check failed', 500, 'INTERNAL_ERROR')
  }
}
