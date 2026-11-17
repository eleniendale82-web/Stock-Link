import { prisma } from '@/lib/prisma'

export async function getPublicCategories() {
  return prisma.category.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      image: true,
    },
  })
}
