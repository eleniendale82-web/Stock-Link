import { NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from './logger'

export interface ApiErrorDetail {
  field: string
  message: string
}

const STATUS_CODES: Record<number, string> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMITED',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE',
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code: string = STATUS_CODES[statusCode] ?? 'BAD_REQUEST',
    public details?: ApiErrorDetail[]
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function errorResponse(
  message: string,
  status = 400,
  code = STATUS_CODES[status] ?? 'BAD_REQUEST',
  details?: ApiErrorDetail[],
  headers?: HeadersInit,
  data: unknown = null
) {
  return NextResponse.json(
    {
      success: false,
      message,
      error: { code, ...(details?.length ? { details } : {}) },
      data,
      meta: null,
    },
    { status, headers }
  )
}

function validationDetails(error: z.ZodError): ApiErrorDetail[] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'body',
    message: issue.message,
  }))
}

function prismaErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') return undefined
  const code = 'code' in error ? error.code : 'errorCode' in error ? error.errorCode : undefined
  return typeof code === 'string' && /^P\d{4}$/.test(code) ? code : undefined
}

export function handleApiError(error: unknown, headers?: HeadersInit) {
  if (error instanceof ApiError) {
    return errorResponse(error.message, error.statusCode, error.code, error.details, headers)
  }

  if (error instanceof z.ZodError) {
    return errorResponse(
      'Request validation failed',
      422,
      'VALIDATION_ERROR',
      validationDetails(error),
      headers
    )
  }

  switch (prismaErrorCode(error)) {
    case 'P2002':
      return errorResponse('A resource with these details already exists', 409, 'CONFLICT', undefined, headers)
    case 'P2025':
      return errorResponse('The requested resource was not found', 404, 'NOT_FOUND', undefined, headers)
    case 'P2003':
    case 'P2014':
      return errorResponse(
        'The request conflicts with related data',
        422,
        'VALIDATION_ERROR',
        undefined,
        headers
      )
    case 'P2024':
      return errorResponse(
        'A required service is temporarily unavailable',
        503,
        'SERVICE_UNAVAILABLE',
        undefined,
        headers
      )
    case 'P1001':
    case 'P1002':
    case 'P1008':
      return errorResponse(
        'A required service is temporarily unavailable',
        503,
        'SERVICE_UNAVAILABLE',
        undefined,
        headers
      )
  }

  logger.error('Unhandled API error', {
    errorName: error instanceof Error ? error.name : 'UnknownError',
  })
  return errorResponse('An unexpected error occurred', 500, 'INTERNAL_ERROR', undefined, headers)
}
