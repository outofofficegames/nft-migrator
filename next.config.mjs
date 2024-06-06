/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  images: {
    remotePatterns: [
      {
        hostname: 'ipfs.io',
        protocol: 'https'
      }
    ]
  }
}

export default nextConfig
