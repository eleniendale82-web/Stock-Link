import { beforeEach, describe, expect, it, vi } from 'vitest'

const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }))

vi.mock('@/lib/prisma', () => ({ prisma: { product: { findFirst } } }))

import { GET } from '@/app/api/v1/products/[id]/route'

const productId = 'b14322b1-5ed9-4489-9cd0-6a3ba48cf19d'
const categoryId = 'c54ab719-9a58-4988-ade3-1dbfb95b9cf5'
const businessId = '8c558c33-3933-4c8b-9bf4-78c51c64780c'

const databaseProduct = {
  id: productId,
  name: 'White Rice',
  description: 'High-quality white rice',
  price: { toString: () => '500.00' },
  images: ['/products/rice-front.jpg', '/products/rice-back.jpg'],
  sku: 'RICE-01',
  createdAt: new Date('2026-01-10T10:00:00.000Z'),
  updatedAt: new Date('2026-01-12T10:00:00.000Z'),
  categoryId,
  category: { id: categoryId, name: 'Food', slug: 'food' },
  business: {
    id: businessId,
    name: 'Example Grocery Shop',
    description: 'A local grocery shop',
    logo: '/shops/example.png',
    verified: true,
    ownerId: 'private-owner-id',
  },
}

function context(id = productId) {
  return { params: { id } }
}

describe('GET /api/v1/products/:id', () => {
  beforeEach(() => findFirst.mockReset())

  it('returns the product, all ordered image URLs, category, and public shop details', async () => {
    findFirst.mockResolvedValueOnce(databaseProduct)

    const response = await GET(new Request(`http://localhost/api/v1/products/${productId}`), context())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toEqual({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        id: productId,
        name: 'White Rice',
        description: 'High-quality white rice',
        price: 500,
        images: ['/products/rice-front.jpg', '/products/rice-back.jpg'],
        sku: 'RICE-01',
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-12T10:00:00.000Z',
        categoryId,
        category: { id: categoryId, name: 'Food', slug: 'food' },
        shop: {
          id: businessId,
          name: 'Example Grocery Shop',
          description: 'A local grocery shop',
          logoUrl: '/shops/example.png',
          verified: true,
        },
      },
      meta: null,
    })
    expect(JSON.stringify(body)).not.toContain('private-owner-id')
    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: productId,
          deletedAt: null,
          category: { is: { isActive: true, deletedAt: null } },
          business: { is: { deletedAt: null } },
        },
        select: expect.objectContaining({
          images: true,
          category: { select: { id: true, name: true, slug: true } },
          business: {
            select: { id: true, name: true, description: true, logo: true, verified: true },
          },
        }),
      })
    )
  })

  it('returns an empty image array for products without images', async () => {
    findFirst.mockResolvedValueOnce({ ...databaseProduct, images: [] })

    const response = await GET(new Request('http://localhost'), context())
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data.images).toEqual([])
  })

  it('filters private filesystem image paths and shop logos', async () => {
    findFirst.mockResolvedValueOnce({
      ...databaseProduct,
      images: ['/products/public.jpg', 'C:\\private\\image.jpg'],
      business: { ...databaseProduct.business, logo: 'C:\\private\\logo.png' },
    })

    const response = await GET(new Request('http://localhost'), context())
    const body = await response.json()

    expect(body.data.images).toEqual(['/products/public.jpg'])
    expect(body.data.shop.logoUrl).toBeNull()
    expect(JSON.stringify(body)).not.toContain('C:\\private')
  })

  it('returns 404 for products that do not exist or are not public', async () => {
    findFirst.mockResolvedValueOnce(null)

    const response = await GET(new Request('http://localhost'), context())
    const body = await response.json()

    expect(response.status).toBe(404)
    expect(body.error.code).toBe('PRODUCT_NOT_FOUND')
  })

  it('rejects malformed IDs before querying the database', async () => {
    const response = await GET(new Request('http://localhost'), context('product-123'))
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body.error.code).toBe('INVALID_PRODUCT_ID')
    expect(findFirst).not.toHaveBeenCalled()
  })

  it('returns sanitized errors for database failures', async () => {
    findFirst.mockRejectedValueOnce(new Error('SQL credentials and stack'))

    const response = await GET(new Request('http://localhost'), context())
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error.code).toBe('INTERNAL_ERROR')
    expect(JSON.stringify(body)).not.toContain('SQL credentials and stack')
  })

  it('returns 503 for recognized temporary database failures', async () => {
    findFirst.mockRejectedValueOnce(Object.assign(new Error('private connection data'), { code: 'P1001' }))

    const response = await GET(new Request('http://localhost'), context())
    const body = await response.json()

    expect(response.status).toBe(503)
    expect(body.error.code).toBe('SERVICE_UNAVAILABLE')
    expect(JSON.stringify(body)).not.toContain('private connection data')
  })
})
