import { NextResponse } from 'next/server'
import type { PaginationMeta } from '@/types/api.types'

export function successResponse<T>(
  data: T,
  status = 200,
  message = 'Request completed successfully',
  meta: PaginationMeta | Record<string, unknown> | null = null,
  headers?: HeadersInit
) {
  return NextResponse.json(
    { success: true, message, data, meta },
    { status, headers }
  )
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Resources retrieved successfully'
) {
  return successResponse(
    data,
    200,
    message,
    { total, page, limit, totalPages: Math.ceil(total / limit) }
  )
}
