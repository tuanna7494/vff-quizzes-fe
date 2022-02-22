/**
 * @type {import('next').NextConfig}
 */
const path = require('path');

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    domains: [
      'quizzes.vfftech.com',
      'quizzes.chuctet.online',
      'localhost',
      'vumax.me'
    ]
  },
  future: {
    webpack5: true
  },
  env: {
    siteName: 'Quiz',
    uploadSizeLimit: 2097152,
    uploadAcceptType: 'image/jpeg, image/png',
    formLimitTextarea: 255
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };

    return config;
  }
};

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// });

// module.exports = withBundleAnalyzer({
//   reactStrictMode: true
// });
