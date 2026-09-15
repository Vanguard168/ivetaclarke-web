/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/masterclass", destination: "/?_section=masterclass" },
    ];
  },
};

module.exports = nextConfig
