/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'yourdomain.com'], // دامنه‌هایی که تصاویر ازشون میاد
  },
};

module.exports = nextConfig;