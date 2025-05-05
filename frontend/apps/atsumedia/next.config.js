const {
  composePlugins,
  withNx
} = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  reactStrictMode: false,
  basePath: '/test/frontend',
  trailingSlash: true,
  // basePath: '/media',
  experimental: {
    optimizePackageImports: [
      '@atsumedia/amplify-backend',
      '@atsumedia/amplify-client',
      '@atsumedia/shared-ui',
      '@atsumedia/shared-util',
      '@atsumedia/data',
      '@aws-amplify/ui-react',
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  webpack: (config, {
    isServer
  }) => {
    // 🔥 Disable cache to prevent corrupted .next/cache issues
    config.cache = false;

    // You can add more Webpack customizations here if needed

    return config;
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
          key: 'Cache-Control',
          value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        },
        {
          key: 'Surrogate-Control',
          value: 'no-store',
        },
      ],
    }, ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
