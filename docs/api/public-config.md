# Public Configuration API

`GET /api/v1/config/public` is available without authentication or a request body. It returns the public app identity, supported currency and language lists, public contacts, feature availability, regional defaults, and marketplace limits. Feature flags describe frontend availability; protected APIs must enforce authorization separately.

Responses use HTTP 200 and are cached with `Cache-Control: public, max-age=300, stale-while-revalidate=60`. A configuration assembly error returns a generic HTTP 500 response with `Cache-Control: no-store`.

```json
{
  "success": true,
  "message": "Public configuration retrieved successfully",
  "data": {
    "app": {
      "name": "StockLink",
      "description": "Inventory and marketplace management platform",
      "version": "1.0.0",
      "logoUrl": null,
      "websiteUrl": null,
      "supportEmail": null
    },
    "currency": {
      "defaultCurrency": "ETB",
      "supportedCurrencies": [
        { "code": "ETB", "name": "Ethiopian Birr", "symbol": "Br" },
        { "code": "USD", "name": "US Dollar", "symbol": "$" }
      ]
    },
    "localization": {
      "defaultLanguage": "en",
      "supportedLanguages": [{ "code": "en", "name": "English", "isDefault": true }]
    },
    "contact": {
      "email": null,
      "phone": null,
      "website": null,
      "businessAddress": null,
      "socialLinks": { "facebook": null, "telegram": null, "instagram": null }
    },
    "features": {
      "marketplaceEnabled": true,
      "productSearchEnabled": true,
      "shopDiscoveryEnabled": true,
      "nearbyShopsEnabled": true,
      "mapViewEnabled": true,
      "guestBrowsingEnabled": true,
      "multiCurrencyEnabled": false
    },
    "regional": {
      "defaultCountry": "ET",
      "defaultRegion": null,
      "timezone": "Africa/Addis_Ababa",
      "dateFormat": "DD/MM/YYYY",
      "supportedCountries": ["ET"]
    },
    "marketplace": {
      "defaultPageSize": 20,
      "maxPageSize": 100,
      "defaultRadiusKm": 5,
      "maxRadiusKm": 50,
      "allowGuestBrowsing": true
    }
  },
  "meta": null
}
```

Current defaults are sourced from the existing app configuration where available: application name/version, ETB, English, and pagination limits. Ethiopian regional defaults and the additional public feature/default-radius values are sensible project defaults, not verified deployment settings. English is the only language advertised by default; configure another language only after its frontend localization is supported. No production website, contact, or address is assumed.

Explicit public environment settings can override defaults: `APP_NAME`, `APP_DESCRIPTION`, `APP_VERSION`, `PUBLIC_LOGO_URL`, `PUBLIC_WEBSITE_URL`, `PUBLIC_SUPPORT_EMAIL`, `PUBLIC_SUPPORT_PHONE`, `PUBLIC_BUSINESS_ADDRESS`, `PUBLIC_FACEBOOK_URL`, `PUBLIC_TELEGRAM_URL`, `PUBLIC_INSTAGRAM_URL`, `DEFAULT_CURRENCY`, `SUPPORTED_CURRENCIES`, `DEFAULT_LANGUAGE`, `SUPPORTED_LANGUAGES`, `DEFAULT_COUNTRY`, `DEFAULT_REGION`, `DEFAULT_TIMEZONE`, `DATE_FORMAT`, `SUPPORTED_COUNTRIES`, `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`, `DEFAULT_RADIUS_KM`, `MAX_RADIUS_KM`, and `PUBLIC_*_ENABLED` flags. Currency and language lists are comma-separated. Invalid values fall back to safe defaults; only explicitly selected variables are returned.
