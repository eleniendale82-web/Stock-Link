import { z } from 'zod'

const optionalUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => value.startsWith('https://') || value.startsWith('http://'), {
    message: 'URL must use HTTP or HTTPS',
  })
  .nullable()

export const publicConfigSchema = z.object({
  APP_NAME: z.string().trim().min(1).optional(),
  APP_DESCRIPTION: z.string().trim().min(1).optional(),
  APP_VERSION: z.string().trim().min(1).optional(),
  PUBLIC_LOGO_URL: optionalUrl.optional(),
  PUBLIC_WEBSITE_URL: optionalUrl.optional(),
  PUBLIC_SUPPORT_EMAIL: z.string().trim().email().nullable().optional(),
  PUBLIC_SUPPORT_PHONE: z.string().trim().min(1).nullable().optional(),
  DEFAULT_CURRENCY: z.string().regex(/^[A-Z]{3}$/).optional(),
  SUPPORTED_CURRENCIES: z.string().optional(),
  DEFAULT_LANGUAGE: z.string().regex(/^[a-z]{2,3}(-[A-Z]{2})?$/).optional(),
  SUPPORTED_LANGUAGES: z.string().optional(),
  DEFAULT_COUNTRY: z.string().regex(/^[A-Z]{2}$/).optional(),
  DEFAULT_REGION: z.string().trim().nullable().optional(),
  DEFAULT_TIMEZONE: z.string().trim().min(1).optional(),
  DATE_FORMAT: z.string().trim().min(1).optional(),
  SUPPORTED_COUNTRIES: z.string().optional(),
  DEFAULT_PAGE_SIZE: z.coerce.number().int().positive().optional(),
  MAX_PAGE_SIZE: z.coerce.number().int().positive().optional(),
  DEFAULT_RADIUS_KM: z.coerce.number().positive().optional(),
  MAX_RADIUS_KM: z.coerce.number().positive().optional(),
  PUBLIC_BUSINESS_ADDRESS: z.string().trim().nullable().optional(),
  PUBLIC_FACEBOOK_URL: optionalUrl.optional(),
  PUBLIC_TELEGRAM_URL: optionalUrl.optional(),
  PUBLIC_INSTAGRAM_URL: optionalUrl.optional(),
  PUBLIC_MARKETPLACE_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_PRODUCT_SEARCH_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_SHOP_DISCOVERY_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_NEARBY_SHOPS_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_MAP_VIEW_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_GUEST_BROWSING_ENABLED: z.enum(['true', 'false']).optional(),
  PUBLIC_MULTI_CURRENCY_ENABLED: z.enum(['true', 'false']).optional(),
})

export type PublicConfigEnvironment = z.infer<typeof publicConfigSchema>
