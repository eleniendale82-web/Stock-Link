export interface PublicAppConfig {
  name: string
  description: string
  version: string
  logoUrl: string | null
  websiteUrl: string | null
  supportEmail: string | null
}

export interface PublicCurrencyConfig {
  defaultCurrency: string
  supportedCurrencies: Array<{ code: string; name: string; symbol: string }>
}

export interface PublicLocalizationConfig {
  defaultLanguage: string
  supportedLanguages: Array<{ code: string; name: string; isDefault: boolean }>
}

export interface PublicContactConfig {
  email: string | null
  phone: string | null
  website: string | null
  businessAddress: string | null
  socialLinks: { facebook: string | null; telegram: string | null; instagram: string | null }
}

export interface PublicFeatureFlags {
  marketplaceEnabled: boolean
  productSearchEnabled: boolean
  shopDiscoveryEnabled: boolean
  nearbyShopsEnabled: boolean
  mapViewEnabled: boolean
  guestBrowsingEnabled: boolean
  multiCurrencyEnabled: boolean
}

export interface PublicRegionalConfig {
  defaultCountry: string
  defaultRegion: string | null
  timezone: string
  dateFormat: string
  supportedCountries: string[]
}

export interface PublicMarketplaceConfig {
  defaultPageSize: number
  maxPageSize: number
  defaultRadiusKm: number
  maxRadiusKm: number
  allowGuestBrowsing: boolean
}

export interface PublicConfigResponse {
  app: PublicAppConfig
  currency: PublicCurrencyConfig
  localization: PublicLocalizationConfig
  contact: PublicContactConfig
  features: PublicFeatureFlags
  regional: PublicRegionalConfig
  marketplace: PublicMarketplaceConfig
}
