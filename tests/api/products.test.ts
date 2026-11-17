import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { findMany, count, transaction } = vi.hoisted(() => ({
  findMany: vi.fn(),
  count: vi.fn(),
  transaction: vi.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: { product: { findMany, count }, $transaction: transaction },
}))

import { GET } from '@/app/api/v1/products/route'

const categoryId = 'c54ab719-9a58-4988-ade3-1dbfb95b9cf5'
const product = {
  id: 'p-1',
  name: 'White Rice',
  description: 'High-quality rice',
  price: 500,
  images: ['/products/rice.png'],
  categoryId,
  category: { id: categoryId, name: 'Food' },
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
}

function request(query = '') {
  return new NextRequest(`http://localhost/api/v1/products${query ? `?${query}` : ''}`)
}

function mockResult(products: (typeof product)[] = [], total = products.length) {
  findMany.mockResolvedValueOnce(products)
  count.mockResolvedValueOnce(total)
}

describe('GET /api/v1/products', () => {
  beforeEach(() => {
    findMany.mockReset()
    count.mockReset()
    transaction.mockClear()
    transaction.mockImplementation((queries) => Promise.all(queries))
  })

  it('retrieves a page using default pagination and returns product fields and metadata', async () => {
    mockResult([product], 45)

    const response = await GET(request())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toMatchObject({
      success: true,
      message: 'Products retrieved successfully',
      data: [
        {
          id: 'p-1',
          name: 'White Rice',
          description: 'High-quality rice',
          price: 500,
          categoryId,
          category: { id: categoryId, name: 'Food' },
          images: ['/products/rice.png'],
        },
      ],
      meta: {
        pagination: {
          page: 1,
          limit: 10,
          total: 45,
          totalPages: 5,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    })
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 10, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] })
    )
  })

  it('uses custom page and limit and accepts the maximum limit', async () => {
    mockResult([], 0)
    const response = await GET(request('page=2&limit=100'))

    expect(response.status).toBe(200)
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 100, take: 100 }))
  })

  it('returns a successful empty page with zero pagination totals', async () => {
    mockResult([], 0)
    const response = await GET(request('page=2&limit=10'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toEqual([])
    expect(body.meta.pagination).toEqual({
      page: 2,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    })
  })

  it('searches name, description, and SKU case-insensitively', async () => {
    mockResult()
    await GET(request('search=rice'))
    expect(findMany.mock.calls[0][0].where.OR).toEqual([
      { name: { contains: 'rice', mode: 'insensitive' } },
      { description: { contains: 'rice', mode: 'insensitive' } },
      { sku: { contains: 'rice', mode: 'insensitive' } },
    ])
  })

  it('combines search, category and inclusive price filters for list and count', async () => {
    mockResult()
    await GET(
      request(`search=rice&categoryId=${categoryId}&minPrice=100&maxPrice=1000`)
    )

    const listWhere = findMany.mock.calls[0][0].where
    expect(listWhere).toMatchObject({
      categoryId,
      price: { gte: 100, lte: 1000 },
      OR: expect.any(Array),
      deletedAt: null,
      category: { is: { isActive: true, deletedAt: null } },
      business: { is: { deletedAt: null } },
    })
    expect(count.mock.calls[0][0].where).toBe(listWhere)
  })

  it.each([
    ['minPrice=100', { gte: 100 }],
    ['maxPrice=1000', { lte: 1000 }],
  ])('supports the price boundary filter %s', async (query, expectedPrice) => {
    mockResult()
    await GET(request(query))
    expect(findMany.mock.calls[0][0].where.price).toEqual(expectedPrice)
  })

  it.each([
    ['sortBy=price&sortOrder=asc', [{ price: 'asc' }, { id: 'asc' }]],
    ['sortBy=price&sortOrder=desc', [{ price: 'desc' }, { id: 'asc' }]],
    ['sortBy=createdAt&sortOrder=desc', [{ createdAt: 'desc' }, { id: 'asc' }]],
    ['sortBy=name&sortOrder=asc', [{ name: 'asc' }, { id: 'asc' }]],
  ])('sorts with an allowlisted order: %s', async (query, expectedOrder) => {
    mockResult()
    await GET(request(query))
    expect(findMany.mock.calls[0][0].orderBy).toEqual(expectedOrder)
  })

  it.each([
    'page=-1',
    'limit=abc',
    'limit=101',
    'minPrice=-100',
    'minPrice=1000&maxPrice=100',
    'sortBy=password',
    'sortOrder=random',
    'categoryId=not-a-uuid',
  ])('rejects invalid query parameters: %s', async (query) => {
    const response = await GET(request(query))
    const body = await response.json()

    expect(response.status).toBe(422)
    expect(body.error.code).toBe('VALIDATION_ERROR')
    expect(findMany).not.toHaveBeenCalled()
  })

  it('does not return soft-deleted products or products in hidden categories', async () => {
    mockResult()
    await GET(request())
    expect(findMany.mock.calls[0][0].where).toMatchObject({
      deletedAt: null,
      category: { is: { isActive: true, deletedAt: null } },
      business: { is: { deletedAt: null } },
    })
  })

  it('returns sanitized database errors with appropriate status codes', async () => {
    findMany.mockRejectedValueOnce(new Error('SQL and credentials'))
    count.mockResolvedValueOnce(0)
    const response = await GET(request())
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(JSON.stringify(body)).not.toContain('SQL and credentials')
  })

  it('returns 503 for recognized temporary database availability errors', async () => {
    findMany.mockRejectedValueOnce(Object.assign(new Error('database host'), { code: 'P1001' }))
    count.mockResolvedValueOnce(0)
    const response = await GET(request())
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE')
    expect(JSON.stringify(body)).not.toContain('database host')
  })
})
