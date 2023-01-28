/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_ROOT: 'http://localhost:5000/api',
  },
}

module.exports = nextConfig
