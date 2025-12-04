/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,        // فعال‌سازی حالت Strict برای React
  swcMinify: true,              // استفاده از SWC برای Minify سریع‌تر
  eslint: {
    ignoreDuringBuilds: true,   // جلوگیری از توقف Build به خاطر خطاهای ESLint
  },
  typescript: {
    ignoreBuildErrors: true,    // جلوگیری از توقف Build به خاطر خطاهای TypeScript
  },
  images: {
    domains: ['localhost'],     // اجازه بارگذاری تصاویر از دامنه‌های مشخص
  },
  experimental: {
    appDir: false,              // غیرفعال کردن حالت App Router اگر استفاده نمی‌کنی
  },
  output: 'export',             // فعال‌سازی خروجی استاتیک (جایگزین next export)
};

module.exports = nextConfig;