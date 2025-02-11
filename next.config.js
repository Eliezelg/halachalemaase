/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ]
      }
    ]
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true, // Permet l'utilisation d'images locales sans optimisation
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    domains: ['localhost'],
  },
  i18n: {
    locales: ['fr', 'he'],
    defaultLocale: 'fr',
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        stream: false,
        crypto: false,
        fs: false,
        os: false,
        path: false,
      },
      alias: {
        canvas: false,
        encoding: false
      }
    };
    return config;
  }
};

module.exports = nextConfig;
