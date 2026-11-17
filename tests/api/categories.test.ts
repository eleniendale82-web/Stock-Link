import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }))

vi.mock('@/lib/prisma', () => ({ prisma: { category: { findMany } } }))

import { GET } from '@/app/api/v1/categories/route'

describe('GET /api/v1/categories', () => {
  beforeEach(() => {
    findMany.mockReset()
  })

  it('returns public categories in the shared response format', async () => {
    findMany.mockResolvedValueOnce([
      {
        id: 'c-1',
        name: 'Clothing',
        slug: 'clothing',
        description: 'Clothing and fashion products',
        image: null,
      },
      {
        id: 'c-2',
        name: 'Electronics',
        slug: 'electronics',
        description: null,
        image: '/images/electronics.png',
      },
    ])

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      message: 'Categories retrieved successfully',
      data: [
        {
          id: 'c-1',
          name: 'Clothing',
          slug: 'clothing',
          description: 'Clothing and fashion products',
          image: null,
        },
        {
          id: 'c-2',
          name: 'Electronics',
          slug: 'electronics',
          description: null,
          image: '/images/electronics.png',
        },
      ],
      meta: null,
    })
    expect(findMany).toHaveBeenCalledWith({
      where: { isActive: true, deletedAt: null },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
      select: { id: true, name: true, slug: true, description: true, image: true },
    })
  })

  it('returns an empty array successfully when there are no categories', async () => {
    findMany.mockResolvedValueOnce([])

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(body.data).toEqual([])
  })

  it('returns a sanitized error when the database query fails', async () => {
    findMany.mockRejectedValueOnce(new Error('database credentials and SQL'))

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(JSON.stringify(body)).not.toContain('database credentials and SQL')
  })

  it('returns service unavailable for a recognized temporary database outage', async () => {
    findMany.mockRejectedValueOnce(
      Object.assign(new Error('connection details'), { errorCode: 'P1001' })
    )

    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE')
    expect(JSON.stringify(body)).not.toContain('connection details')
  })
})
