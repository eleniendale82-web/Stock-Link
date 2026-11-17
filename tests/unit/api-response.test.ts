import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { errorResponse, handleApiError } from '@/lib/api-error'
import { paginatedResponse, successResponse } from '@/lib/api-response'

describe('shared API responses', () => {
  it('returns the standard success envelope with optional message and metadata', async () => {
    const response = successResponse({ id: 'item-1' }, 201, 'Item created')
    expect(response.status).toBe(201)
    expect(await response.json()).toEqual({
      success: true,
      message: 'Item created',
      data: { id: 'item-1' },
      meta: null,
    })
  })

  it('returns pagination in meta', async () => {
    const response = paginatedResponse([{ id: 'item-1' }], 21, 2, 10, 'Items retrieved')
    expect(await response.json()).toMatchObject({
      success: true,
      message: 'Items retrieved',
      meta: { total: 21, page: 2, limit: 10, totalPages: 3 },
    })
  })

  it('uses a consistent error envelope', async () => {
    const response = errorResponse('Not found', 404, 'NOT_FOUND')
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      success: false,
      message: 'Not found',
      error: { code: 'NOT_FOUND' },
      data: null,
      meta: null,
    })
  })

  it('maps Zod validation errors to field details', async () => {
    const parsed = z.object({ name: z.string().min(1) }).safeParse({ name: '' })
    if (parsed.success) throw new Error('Expected schema validation to fail')

    const response = handleApiError(parsed.error)
    expect(response.status).toBe(422)
    expect(await response.json()).toMatchObject({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        details: [{ field: 'name', message: expect.any(String) }],
      },
    })
  })

  it('maps Prisma errors without exposing their details', async () => {
    const response = handleApiError(
      Object.assign(new Error('database and constraint details'), { code: 'P2002' })
    )
    const body = await response.json()
    expect(response.status).toBe(409)
    expect(body.error.code).toBe('CONFLICT')
    expect(JSON.stringify(body)).not.toContain('database and constraint details')
  })

  it('sanitizes unexpected errors', async () => {
    const { logger } = await import('@/lib/logger')
    const log = vi.spyOn(logger, 'error').mockImplementation(() => undefined)
    const response = handleApiError(new Error('sensitive internals'))
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(JSON.stringify(body)).not.toContain('sensitive internals')
    log.mockRestore()
  })
})
