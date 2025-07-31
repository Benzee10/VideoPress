/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Vercel deployment
  output: 'export',
  trailingSlash: true,
  
  // Image optimization settings
  images: {
    unoptimized: true, // Required for static export
    domains: [
      'images.unsplash.com',
      'example.com',
      'sample-videos.com'
    ],
  },
  
  // Video and media support
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ],
      }
    ];
  },
  
  // Webpack configuration for better video handling
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    
    return config;
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;