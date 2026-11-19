import { prisma } from '@/lib/prisma'

function isPublicAssetReference(value: string): boolean {
  if (value.startsWith('/')) {
    return !value.startsWith('//') && !value.includes('\\') && !value.split('/').includes('..')
  }

  try {
    const url = new URL(value)
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      !url.username &&
      !url.password
    )
  } catch {
    return false
  }
}

export async function getPublicProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      deletedAt: null,
      category: { is: { isActive: true, deletedAt: null } },
      business: { is: { deletedAt: null } },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      sku: true,
      createdAt: true,
      updatedAt: true,
      categoryId: true,
      category: { select: { id: true, name: true, slug: true } },
      business: {
        select: { id: true, name: true, description: true, logo: true, verified: true },
      },
    },
  })

  if (!product) return null

  const { business, price, ...publicProduct } = product
  return {
    ...publicProduct,
    price: Number(price),
    images: publicProduct.images.filter(isPublicAssetReference),
    shop: {
      id: business.id,
      name: business.name,
      description: business.description,
      logoUrl: business.logo && isPublicAssetReference(business.logo) ? business.logo : null,
      verified: business.verified,
    },
  }
}
