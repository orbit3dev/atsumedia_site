const { composePlugins, withNx } = require('@nx/next');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	reactStrictMode: false,
	basePath: '/test/frontend',
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
};

const plugins = [
	// Add more Next.js plugins to this list if needed.
	withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
