import packageJson from '../../../package.json'
import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

const DATABASE_TIMEOUT_MS = 2_000

type HealthEnvironment = 'development' | 'staging' | 'production'

function getEnvironment(): HealthEnvironment {
  const configuredEnvironment = process.env.APP_ENV
  if (
    configuredEnvironment === 'development' ||
    configuredEnvironment === 'staging' ||
    configuredEnvironment === 'production'
  ) {
    return configuredEnvironment
  }

  return process.env.NODE_ENV === 'production' ? 'production' : 'development'
}

async function checkDatabase() {
  const startedAt = Date.now()
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    await Promise.race([
      prisma.$runCommandRaw({ ping: 1 }),
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error('Health check database timeout')), DATABASE_TIMEOUT_MS)
        timeout.unref?.()
      }),
    ])

    return { status: 'connected' as const, responseTime: Date.now() - startedAt }
  } catch {
    logger.warn('Health check database dependency unavailable')
    return { status: 'disconnected' as const }
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

export async function getHealthStatus() {
  const timestamp = new Date().toISOString()
  const database = await checkDatabase()
  const healthy = database.status === 'connected'

  if (!healthy) {
    return {
      healthy,
      data: {
        status: 'unhealthy' as const,
        service: 'StockLink API',
        timestamp,
        dependencies: { database },
      },
    }
  }

  return {
    healthy,
    data: {
      status: 'healthy' as const,
      service: 'StockLink API',
      version: packageJson.version,
      environment: getEnvironment(),
      timestamp,
      uptime: Math.floor(process.uptime()),
      dependencies: { database },
    },
  }
}
