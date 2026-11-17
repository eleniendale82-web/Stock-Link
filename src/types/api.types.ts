export interface ApiResponse<T> {
  success: true
  message: string
  data: T
  meta: PaginationMeta | Record<string, unknown> | null
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiErrorResponse {
  success: false
  message: string
  error: {
    code: string
    details?: Array<{ field: string; message: string }>
  }
  data: null
  meta: null
}

// Backward-compatible exported name; API errors now use the complete envelope above.
export type ApiError = ApiErrorResponse

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse
