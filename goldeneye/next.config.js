/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/goldeneye',
  assetPrefix: '/goldeneye/',
}

module.exports = nextConfig 