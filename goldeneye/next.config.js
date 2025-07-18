/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Force custom domain configuration (no basePath/assetPrefix)
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
}

module.exports = nextConfig 