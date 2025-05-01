/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Ensure the server listens on all interfaces
  experimental: {
    serverComponentsExternalPackages: ['puppeteer'],
  },
}

module.exports = nextConfig 