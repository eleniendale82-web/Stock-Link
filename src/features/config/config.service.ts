import { DEFAULT_FEATURE_FLAGS, DEFAULT_PUBLIC_CONFIG } from './config.constants'
import { publicConfigSchema } from './config.schema'
import type { PublicConfigResponse } from './config.types'

const environmentKeys = [
  'APP_NAME',
  'APP_DESCRIPTION',
  'APP_VERSION',
  'PUBLIC_LOGO_URL',
  'PUBLIC_WEBSITE_URL',
  'PUBLIC_SUPPORT_EMAIL',
  'PUBLIC_SUPPORT_PHONE',
  'DEFAULT_CURRENCY',
  'SUPPORTED_CURRENCIES',
  'DEFAULT_LANGUAGE',
  'SUPPORTED_LANGUAGES',
  'DEFAULT_COUNTRY',
  'DEFAULT_REGION',
  'DEFAULT_TIMEZONE',
  'DATE_FORMAT',
  'SUPPORTED_COUNTRIES',
  'DEFAULT_PAGE_SIZE',
  'MAX_PAGE_SIZE',
  'DEFAULT_RADIUS_KM',
  'MAX_RADIUS_KM',
  'PUBLIC_BUSINESS_ADDRESS',
  'PUBLIC_FACEBOOK_URL',
  'PUBLIC_TELEGRAM_URL',
  'PUBLIC_INSTAGRAM_URL',
  'PUBLIC_MARKETPLACE_ENABLED',
  'PUBLIC_PRODUCT_SEARCH_ENABLED',
  'PUBLIC_SHOP_DISCOVERY_ENABLED',
  'PUBLIC_NEARBY_SHOPS_ENABLED',
  'PUBLIC_MAP_VIEW_ENABLED',
  'PUBLIC_GUEST_BROWSING_ENABLED',
  'PUBLIC_MULTI_CURRENCY_ENABLED',
] as const

function getValidatedEnvironment() {
  const values = Object.fromEntries(
    environmentKeys.flatMap((key) => {
      const parsed = publicConfigSchema.shape[key].safeParse(process.env[key])
      return parsed.success ? [[key, parsed.data]] : []
    })
  )
  return publicConfigSchema.parse(values)
}

function csv(value: string | undefined, fallback: string[]): string[] {
  if (!value) return fallback
  const entries = value.split(',').map((entry) => entry.trim()).filter(Boolean)
  return entries.length ? [...new Set(entries)] : fallback
}

function isValidCurrency(code: string): boolean {
  try {
    return Intl.supportedValuesOf('currency').includes(code)
  } catch {
    return code === 'ETB' || code === 'USD'
  }
}

function isValidCountry(code: string): boolean {
  if (!/^[A-Z]{2}$/.test(code)) return false
  const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code)
  return Boolean(name && name !== code && name !== 'Unknown Region')
}

function getCurrencies(codes: string[]) {
  return codes.filter(isValidCurrency).map((code) => ({
    code,
    name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(code) ?? code,
    symbol:
      code === 'ETB'
        ? 'Br'
        : new Intl.NumberFormat('en', {
            style: 'currency',
            currency: code,
            currencyDisplay: 'narrowSymbol',
          })
            .formatToParts(0)
            .find((part) => part.type === 'currency')?.value ?? code,
  }))
}

function getLanguages(codes: string[], defaultLanguage: string) {
  const supported = codes.includes(defaultLanguage) ? codes : [defaultLanguage, ...codes]
  return supported.map((code) => ({
    code,
    name: new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code,
    isDefault: code === defaultLanguage,
  }))
}

function publicBoolean(value: string | undefined, fallback: boolean) {
  return value === undefined ? fallback : value === 'true'
}

function validTimezone(value: string | undefined, fallback: string) {
  if (!value) return fallback
  try {
    new Intl.DateTimeFormat('en', { timeZone: value })
    return value
  } catch {
    return fallback
  }
}

export function getPublicConfig(): PublicConfigResponse {
  const env = getValidatedEnvironment()
  const defaultCurrency = env.DEFAULT_CURRENCY ?? DEFAULT_PUBLIC_CONFIG.currency.defaultCurrency
  const currencyCodes = csv(env.SUPPORTED_CURRENCIES, [
    ...DEFAULT_PUBLIC_CONFIG.currency.supportedCurrencies.map(({ code }) => code),
  ]).filter(isValidCurrency)
  const resolvedDefaultCurrency = isValidCurrency(defaultCurrency)
    ? defaultCurrency
    : DEFAULT_PUBLIC_CONFIG.currency.defaultCurrency
  const supportedCurrencyCodes = currencyCodes.includes(resolvedDefaultCurrency)
    ? currencyCodes
    : [resolvedDefaultCurrency, ...currencyCodes]
  const defaultLanguage = env.DEFAULT_LANGUAGE ?? DEFAULT_PUBLIC_CONFIG.localization.defaultLanguage
  const supportedLanguages = csv(env.SUPPORTED_LANGUAGES, [
    DEFAULT_PUBLIC_CONFIG.localization.defaultLanguage,
  ]).filter((code) => /^[a-z]{2,3}(-[A-Z]{2})?$/.test(code))
  const supportedCountries = csv(env.SUPPORTED_COUNTRIES, DEFAULT_PUBLIC_CONFIG.regional.supportedCountries)
    .map((country) => country.toUpperCase())
    .filter(isValidCountry)
  const configuredCountry = env.DEFAULT_COUNTRY ?? DEFAULT_PUBLIC_CONFIG.regional.defaultCountry
  const defaultCountry = isValidCountry(configuredCountry)
    ? configuredCountry
    : DEFAULT_PUBLIC_CONFIG.regional.defaultCountry
  const countries = supportedCountries.includes(defaultCountry)
    ? supportedCountries
    : [defaultCountry, ...supportedCountries]

  const features = {
    marketplaceEnabled: publicBoolean(
      env.PUBLIC_MARKETPLACE_ENABLED,
      DEFAULT_FEATURE_FLAGS.marketplaceEnabled
    ),
    productSearchEnabled: publicBoolean(
      env.PUBLIC_PRODUCT_SEARCH_ENABLED,
      DEFAULT_FEATURE_FLAGS.productSearchEnabled
    ),
    shopDiscoveryEnabled: publicBoolean(
      env.PUBLIC_SHOP_DISCOVERY_ENABLED,
      DEFAULT_FEATURE_FLAGS.shopDiscoveryEnabled
    ),
    nearbyShopsEnabled: publicBoolean(
      env.PUBLIC_NEARBY_SHOPS_ENABLED,
      DEFAULT_FEATURE_FLAGS.nearbyShopsEnabled
    ),
    mapViewEnabled: publicBoolean(env.PUBLIC_MAP_VIEW_ENABLED, DEFAULT_FEATURE_FLAGS.mapViewEnabled),
    guestBrowsingEnabled: publicBoolean(
      env.PUBLIC_GUEST_BROWSING_ENABLED,
      DEFAULT_FEATURE_FLAGS.guestBrowsingEnabled
    ),
    multiCurrencyEnabled: publicBoolean(
      env.PUBLIC_MULTI_CURRENCY_ENABLED,
      DEFAULT_FEATURE_FLAGS.multiCurrencyEnabled
    ),
  }

  const minPageSize = 1
  const maxPageSize = Math.max(minPageSize, env.MAX_PAGE_SIZE ?? DEFAULT_PUBLIC_CONFIG.marketplace.maxPageSize)
  const defaultPageSize = Math.min(
    maxPageSize,
    Math.max(minPageSize, env.DEFAULT_PAGE_SIZE ?? DEFAULT_PUBLIC_CONFIG.marketplace.defaultPageSize)
  )
  const maxRadiusKm = Math.max(0.1, env.MAX_RADIUS_KM ?? DEFAULT_PUBLIC_CONFIG.marketplace.maxRadiusKm)
  const defaultRadiusKm = Math.min(
    maxRadiusKm,
    Math.max(0.1, env.DEFAULT_RADIUS_KM ?? DEFAULT_PUBLIC_CONFIG.marketplace.defaultRadiusKm)
  )
  const website = env.PUBLIC_WEBSITE_URL ?? null

  return {
    app: {
      name: env.APP_NAME ?? DEFAULT_PUBLIC_CONFIG.app.name,
      description: env.APP_DESCRIPTION ?? DEFAULT_PUBLIC_CONFIG.app.description,
      version: env.APP_VERSION ?? DEFAULT_PUBLIC_CONFIG.app.version,
      logoUrl: env.PUBLIC_LOGO_URL ?? null,
      websiteUrl: website,
      supportEmail: env.PUBLIC_SUPPORT_EMAIL ?? null,
    },
    currency: {
      defaultCurrency: resolvedDefaultCurrency,
      supportedCurrencies: getCurrencies(supportedCurrencyCodes),
    },
    localization: {
      defaultLanguage,
      supportedLanguages: getLanguages(
        supportedLanguages.length
          ? supportedLanguages
          : [DEFAULT_PUBLIC_CONFIG.localization.defaultLanguage],
        defaultLanguage
      ),
    },
    contact: {
      email: env.PUBLIC_SUPPORT_EMAIL ?? null,
      phone: env.PUBLIC_SUPPORT_PHONE ?? null,
      website,
      businessAddress: env.PUBLIC_BUSINESS_ADDRESS ?? null,
      socialLinks: {
        facebook: env.PUBLIC_FACEBOOK_URL ?? null,
        telegram: env.PUBLIC_TELEGRAM_URL ?? null,
        instagram: env.PUBLIC_INSTAGRAM_URL ?? null,
      },
    },
    features,
    regional: {
      defaultCountry,
      defaultRegion: env.DEFAULT_REGION ?? DEFAULT_PUBLIC_CONFIG.regional.defaultRegion,
      timezone: validTimezone(env.DEFAULT_TIMEZONE, DEFAULT_PUBLIC_CONFIG.regional.timezone),
      dateFormat: env.DATE_FORMAT ?? DEFAULT_PUBLIC_CONFIG.regional.dateFormat,
      supportedCountries: countries,
    },
    marketplace: {
      defaultPageSize,
      maxPageSize,
      defaultRadiusKm,
      maxRadiusKm,
      allowGuestBrowsing: features.guestBrowsingEnabled,
    },
  }
}
