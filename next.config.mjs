/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development
  reactStrictMode: true,

  // Optimize images
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },

  // Experimental features for better Vercel performance
  experimental: {
    // Optimize package imports for smaller bundle
    optimizePackageImports: ['lucide-react', 'react-markdown', 'react-syntax-highlighter'],
  },

  // Production optimizations
  productionBrowserSourceMaps: false,

  // Security: remove X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
