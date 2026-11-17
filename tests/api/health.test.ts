import { beforeEach, describe, expect, it, vi } from 'vitest'

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }))

vi.mock('@/lib/prisma', () => ({ prisma: { $queryRaw: queryRaw } }))

import { GET } from '@/app/api/v1/health/route'

describe('GET /api/v1/health', () => {
  beforeEach(() => {
    queryRaw.mockReset()
    queryRaw.mockResolvedValue([{ '?column?': 1 }])
  })

  it('returns readiness details when the database is available', async () => {
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data).toMatchObject({
      status: 'healthy',
      service: 'StockLink API',
      version: '1.0.0',
      environment: expect.any(String),
      timestamp: expect.stringMatching(/^\d{4}-\d\d-\d\dT/),
      uptime: expect.any(Number),
      dependencies: {
        database: { status: 'connected', responseTime: expect.any(Number) },
      },
    })
    expect(queryRaw).toHaveBeenCalledOnce()
  })

  it('returns 503 without exposing database errors when the database is unavailable', async () => {
    queryRaw.mockRejectedValueOnce(new Error('secret database credentials'))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.success).toBe(false)
    expect(body.message).toBe('A critical dependency is unavailable')
    expect(body.data.status).toBe('unhealthy')
    expect(body.data.dependencies.database).toEqual({ status: 'disconnected' })
    expect(JSON.stringify(body)).not.toContain('secret database credentials')
  })

  it('is callable without credentials or a request body', async () => {
    expect((await GET()).status).toBe(200)
  })

  it('handles unexpected health service errors safely', async () => {
    vi.resetModules()
    vi.doMock('@/features/health/health.service', () => ({
      getHealthStatus: vi.fn().mockRejectedValue(new Error('sensitive internal detail')),
    }))
    const { GET: routeWithUnexpectedError } = await import('@/app/api/v1/health/route')
    const response = await routeWithUnexpectedError()
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.message).toBe('Health check failed')
    expect(JSON.stringify(body)).not.toContain('sensitive internal detail')
    vi.doUnmock('@/features/health/health.service')
    vi.resetModules()
  })
})
