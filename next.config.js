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
  basePath: process.env.NODE_ENV === 'production' ? '/goldeneye' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/goldeneye/' : ''
}

module.exports = nextConfig 