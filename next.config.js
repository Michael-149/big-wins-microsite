/** @type {import('next').NextConfig} */

// The site is host-agnostic: set BASE_PATH to the folder it is served from.
// GitHub Pages serves it from /big-wins-microsite (the default). Use BASE_PATH=""
// to serve it from the root of a domain.
const basePath = (process.env.BASE_PATH ?? '/big-wins-microsite').replace(/\/+$/, '');

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  // Every route is written as <route>/index.html, so any static host (and a
  // plain file server) resolves /lessons/1-public-engagement/ without rewrites.
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
