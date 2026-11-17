import { appConfig } from '@/config/app.config'
import type { PublicConfigResponse, PublicFeatureFlags } from './config.types'

export const DEFAULT_FEATURE_FLAGS: PublicFeatureFlags = {
  marketplaceEnabled: true,
  productSearchEnabled: true,
  shopDiscoveryEnabled: true,
  nearbyShopsEnabled: true,
  mapViewEnabled: true,
  guestBrowsingEnabled: true,
  multiCurrencyEnabled: false,
}

export const DEFAULT_PUBLIC_CONFIG: PublicConfigResponse = {
  app: {
    name: appConfig.name,
    description: 'Inventory and marketplace management platform',
    version: appConfig.version,
    logoUrl: null,
    websiteUrl: null,
    supportEmail: null,
  },
  currency: {
    defaultCurrency: appConfig.defaultCurrency,
    supportedCurrencies: ['ETB', 'USD'].map((code) => ({
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
    })),
  },
  localization: {
    defaultLanguage: appConfig.defaultLocale,
    // English is the only language currently configured by the application.
    supportedLanguages: [{ code: 'en', name: 'English', isDefault: true }],
  },
  contact: {
    email: null,
    phone: null,
    website: null,
    businessAddress: null,
    socialLinks: { facebook: null, telegram: null, instagram: null },
  },
  features: DEFAULT_FEATURE_FLAGS,
  regional: {
    defaultCountry: 'ET',
    defaultRegion: null,
    timezone: 'Africa/Addis_Ababa',
    dateFormat: 'DD/MM/YYYY',
    supportedCountries: ['ET'],
  },
  marketplace: {
    defaultPageSize: appConfig.pagination.defaultLimit,
    maxPageSize: appConfig.pagination.maxLimit,
    defaultRadiusKm: 5,
    maxRadiusKm: 50,
    allowGuestBrowsing: DEFAULT_FEATURE_FLAGS.guestBrowsingEnabled,
  },
}
