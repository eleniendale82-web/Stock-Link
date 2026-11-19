import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import type { ProductQuery } from './products.schema'

export async function getProducts(query: ProductQuery) {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    category: { is: { isActive: true, deletedAt: null } },
    business: { is: { deletedAt: null } },
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search } },
            { description: { contains: query.search } },
            { sku: { contains: query.search } },
          ],
        }
      : {}),
    ...(query.minPrice !== undefined || query.maxPrice !== undefined
      ? {
          price: {
            ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
            ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
          },
        }
      : {}),
  }

  const primaryOrder: Prisma.ProductOrderByWithRelationInput =
    query.sortBy === 'price'
      ? { price: query.sortOrder }
      : query.sortBy === 'name'
        ? { name: query.sortOrder }
        : { createdAt: query.sortOrder }

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [primaryOrder, { id: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        categoryId: true,
        category: { select: { id: true, name: true } },
        createdAt: true,
      },
    }),
    prisma.product.count({ where }),
  ])

  const totalPages = Math.ceil(total / query.limit)
  return {
    products: products.map((product) => ({
      ...product,
      price: Number(product.price),
      images: product.images,
    })),
    pagination: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages,
      hasNextPage: query.page < totalPages,
      hasPreviousPage: query.page > 1 && total > 0,
    },
  }
}
