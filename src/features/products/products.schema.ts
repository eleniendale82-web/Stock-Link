import { z } from 'zod'

const positiveInteger = z.preprocess(
  (value) => (value === undefined ? '1' : value),
  z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().safe().int().positive())
)

const price = z.preprocess(
  (value) => (value === undefined ? undefined : value === '' ? Number.NaN : Number(value)),
  z.number().finite().nonnegative().optional()
)

export const productQuerySchema = z
  .object({
    page: positiveInteger,
    limit: z.preprocess(
      (value) => (value === undefined ? '10' : value),
      z
        .string()
        .regex(/^[1-9]\d*$/)
        .transform(Number)
        .pipe(z.number().safe().int().min(1).max(100))
    ),
    search: z.string().trim().max(100).optional(),
    categoryId: z.string().uuid().optional(),
    minPrice: price,
    maxPrice: price,
    sortBy: z.enum(['createdAt', 'price', 'name']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .superRefine((query, context) => {
    if (query.minPrice !== undefined && query.maxPrice !== undefined && query.minPrice > query.maxPrice) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxPrice'],
        message: 'maxPrice must be greater than or equal to minPrice',
      })
    }

    if (!Number.isSafeInteger((query.page - 1) * query.limit)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['page'],
        message: 'The requested page is too large',
      })
    }
  })

export const productIdSchema = z.string().uuid()

export type ProductQuery = z.infer<typeof productQuerySchema>

export function parseProductQuery(searchParams: URLSearchParams): ProductQuery {
  return productQuerySchema.parse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    categoryId: searchParams.get('categoryId') ?? undefined,
    minPrice: searchParams.get('minPrice') ?? undefined,
    maxPrice: searchParams.get('maxPrice') ?? undefined,
    sortBy: searchParams.get('sortBy') ?? undefined,
    sortOrder: searchParams.get('sortOrder') ?? undefined,
  })
}
