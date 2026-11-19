/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  typescript: {
    // Type checking is handled separately by `npm run type-check` (tsconfig.typecheck.json).
    // This avoids failures caused by incomplete .d.ts files in the Next.js package installation.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint is also run separately in CI lint step.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default nextConfig
