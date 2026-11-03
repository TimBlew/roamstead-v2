/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/listings/house-midway', destination: '/properties/hygge-house', permanent: true },
      { source: '/listings/granary-midway', destination: '/properties/granary', permanent: true },
      // Legacy listing URL discovered by Google Search Console (Granary / Hostaway 455631).
      { source: '/listings/455631', destination: '/properties/granary', permanent: true },
      { source: '/listings/lowell-302', destination: '/properties/lowell', permanent: true },
      { source: '/listings/powder-room', destination: '/properties/powder-room', permanent: true },
    ];
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'd2ol7oe51mr4n9.cloudfront.net' }],
  },
}

module.exports = nextConfig
