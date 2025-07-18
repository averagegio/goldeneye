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
  // Conditionally set basePath and assetPrefix
  // If CUSTOM_DOMAIN is set, don't use basePath (for custom domain)
  // If not set, use /goldeneye (for GitHub Pages subdirectory)
  basePath: process.env.CUSTOM_DOMAIN ? '' : (process.env.NODE_ENV === 'production' ? '/goldeneye' : ''),
  assetPrefix: process.env.CUSTOM_DOMAIN ? '' : (process.env.NODE_ENV === 'production' ? '/goldeneye/' : ''),
  trailingSlash: true,
}

module.exports = nextConfig 