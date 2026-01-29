/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/big-wins-microsite',
  assetPrefix: '/big-wins-microsite',
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
