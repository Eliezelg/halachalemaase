/** @type {import('next').NextConfig} */
const nextConfig = {
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
