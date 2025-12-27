import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable Cache Components for explicit caching with "use cache" directive
  cacheComponents: true,

  experimental: {
    workerThreads: false,
    cpus: 3,
    // Enhanced package optimization for admin/user separation
    optimizePackageImports: ['lucide-react', 'jodit-react', 'motion']
  },
  typescript: {
    ignoreBuildErrors: true
  },

  // Skip build-time API calls to prevent timeouts
  skipProxyUrlNormalize: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io'
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos'
      },
      {
        protocol: 'https',
        hostname: 'example.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  }
}
export default nextConfig
