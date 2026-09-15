/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/masterclass", destination: "/" },
    ];
  },
};

module.exports = nextConfig
