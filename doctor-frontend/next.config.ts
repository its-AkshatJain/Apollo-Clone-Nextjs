/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ Enables static export (formerly `next export`)
  // add any other config options below
  reactStrictMode: true,
  images: {
    unoptimized: true, // required when using 'output: export' for static hosting
  },
};

export default nextConfig;
