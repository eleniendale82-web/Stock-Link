import { describe, expect, it } from 'vitest'
import { GET } from '@/app/api/v1/config/public/route'

describe('GET /api/v1/config/public', () => {
  it('returns the complete public configuration without authentication', async () => {
    const response = GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toContain('max-age=300')
    expect(body).toMatchObject({
      success: true,
      message: 'Public configuration retrieved successfully',
      data: {
        app: { name: 'StockLink', version: expect.any(String) },
        currency: {
          defaultCurrency: 'ETB',
          supportedCurrencies: expect.arrayContaining([
            expect.objectContaining({ code: 'ETB', name: expect.any(String), symbol: expect.any(String) }),
          ]),
        },
        localization: {
          defaultLanguage: 'en',
          supportedLanguages: [
            { code: 'en', name: 'English', isDefault: true },
          ],
        },
        contact: { email: null, socialLinks: expect.any(Object) },
        features: {
          marketplaceEnabled: expect.any(Boolean),
          multiCurrencyEnabled: expect.any(Boolean),
        },
        regional: { defaultCountry: 'ET', timezone: 'Africa/Addis_Ababa' },
        marketplace: {
          defaultPageSize: 20,
          maxPageSize: 100,
          defaultRadiusKm: 5,
          maxRadiusKm: 50,
        },
      },
    })
  })

  it('does not expose private environment variables', async () => {
    const body = await GET().json()
    const serialized = JSON.stringify(body)
    expect(serialized).not.toContain('DATABASE_URL')
    expect(serialized).not.toContain('NEXTAUTH_SECRET')
    expect(serialized).not.toContain('REDIS_URL')
  })
})
