/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['image.tmdb.org'],
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
      // ...outras regras de reescrita se necessário
    ];
  },
};

module.exports = nextConfig;
