// @ts-check

const { i18n } = require('./next-i18next.config');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { createSecureHeaders } = require('next-secure-headers');
const pc = require('picocolors');

const workspaceRoot = path.resolve(__dirname, '..', '..');
/**
 * Once supported replace by node / eslint / ts and out of experimental, replace by
 * `import packageJson from './package.json' assert { type: 'json' };`
 * @type {import('type-fest').PackageJson}
 */
const packageJson = JSON.parse(
  readFileSync(path.join(__dirname, './package.json')).toString('utf-8'),
);

const trueEnv = ['true', '1', 'yes'];

const isProd = process.env.NODE_ENV === 'production';
const isCI = trueEnv.includes(process.env?.CI ?? 'false');

const NEXT_BUILD_ENV_OUTPUT = process.env?.NEXT_BUILD_ENV_OUTPUT ?? 'classic';
const NEXT_BUILD_ENV_TSCONFIG = process.env?.NEXT_BUILD_ENV_TSCONFIG ?? 'tsconfig.json';

const NEXT_BUILD_ENV_TYPECHECK = trueEnv.includes(process.env?.NEXT_BUILD_ENV_TYPECHECK ?? 'true');
const NEXT_BUILD_ENV_LINT = trueEnv.includes(process.env?.NEXT_BUILD_ENV_LINT ?? 'true');
const NEXT_BUILD_ENV_SOURCEMAPS = trueEnv.includes(
  process.env?.NEXT_BUILD_ENV_SOURCEMAPS ?? String(isProd),
);

const NEXT_BUILD_ENV_CSP = trueEnv.includes(process.env?.NEXT_BUILD_ENV_CSP ?? 'true');
const NEXT_ENV_IMAGES_ALL_REMOTE = trueEnv.includes(
  process.env?.NEXT_ENV_IMAGES_ALL_REMOTE ?? 'true',
);

const NEXTJS_SOCKET_PORT = process.env.SOCKET_PORT || '3001';

if (!NEXT_BUILD_ENV_SOURCEMAPS) {
  console.log(
    `- ${pc.green(
      'info',
    )} Sourcemaps generation have been disabled through NEXT_BUILD_ENV_SOURCEMAPS`,
  );
}

// Tell webpack to compile those packages
// @link https://www.npmjs.com/package/next-transpile-modules
const tmModules = [
  // for legacy browsers support (only in prod and none electron)
  ...(isProd && !process.versions['electron'] ? [] : []),
  // ESM only packages are not yet supported by NextJs if you're not
  // using experimental esmExternals
  // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
  // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
  // @link https://github.com/vercel/next.js/issues/23725
  // @link https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
  ...[
    // ie: newer versions of https://github.com/sindresorhus packages
  ],
];

// @link https://github.com/jagaapple/next-secure-headers
const secureHeaders = createSecureHeaders({
  contentSecurityPolicy: {
    directives: NEXT_BUILD_ENV_CSP
      ? {
          defaultSrc: "'self'",
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'https://www.clarity.ms'],
          frameSrc: ["'self'"],
          connectSrc: [
            "'self'",
            'https://*.sentry.io',
            'https://*.flavor.io',
            'https://*.flavor.cn',
            'https://*.clarity.ms',
          ],
          mediaSrc: ["'self'", 'https:', 'http:', 'data:'],
          imgSrc: ["'self'", 'https:', 'http:', 'data:'],
          workerSrc: ['blob:'],
        }
      : {},
  },
  ...(NEXT_BUILD_ENV_CSP && isProd
    ? {
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
      }
    : {}),
  referrerPolicy: 'same-origin',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  transpilePackages: ['@flavor/core', '@flavor/ui'],
  productionBrowserSourceMaps: NEXT_BUILD_ENV_SOURCEMAPS === true,
  optimizeFonts: true,

  httpAgentOptions: {
    // @link https://nextjs.org/blog/next-11-1#builds--data-fetching
    keepAlive: true,
  },

  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: (isCI ? 3600 : 25) * 1000,
  },

  // @link https://nextjs.org/docs/advanced-features/compiler#minification
  // @link discussion: https://github.com/vercel/next.js/discussions/30237
  // Sometimes buggy so enable/disable when debugging.
  swcMinify: true,

  compiler: {
    // emotion: true,
  },

  // @link https://nextjs.org/docs/basic-features/image-optimization
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    loader: 'default',
    dangerouslyAllowSVG: false,
    disableStaticImages: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: NEXT_ENV_IMAGES_ALL_REMOTE
      ? [
          {
            protocol: 'http',
            hostname: '**',
          },
          {
            protocol: 'https',
            hostname: '**',
          },
        ]
      : [
          {
            protocol: 'https',
            hostname: '*.flavor.*',
          },
        ],
    unoptimized: false,
  },

  // Standalone build
  // @link https://nextjs.org/docs/advanced-features/output-file-tracing#automatically-copying-traced-files-experimental
  ...(NEXT_BUILD_ENV_OUTPUT === 'standalone'
    ? { output: 'standalone', outputFileTracing: true }
    : {}),

  experimental: {
    // @link https://nextjs.org/docs/advanced-features/output-file-tracing#caveats
    ...(NEXT_BUILD_ENV_OUTPUT === 'standalone' ? { outputFileTracingRoot: workspaceRoot } : {}),

    // Prefer loading of ES Modules over CommonJS
    // @link {https://nextjs.org/blog/next-11-1#es-modules-support|Blog 11.1.0}
    // @link {https://github.com/vercel/next.js/discussions/27876|Discussion}
    esmExternals: true,
    // Experimental monorepo support
    // @link {https://github.com/vercel/next.js/pull/22867|Original PR}
    // @link {https://github.com/vercel/next.js/discussions/26420|Discussion}
    externalDir: true,

    // Experimental /app dir
    // appDir: true,
  },

  typescript: {
    ignoreBuildErrors: !NEXT_BUILD_ENV_TYPECHECK,
    tsconfigPath: NEXT_BUILD_ENV_TSCONFIG,
  },

  eslint: {
    ignoreDuringBuilds: !NEXT_BUILD_ENV_LINT,
    // dirs: [`${__dirname}/src`],
  },

  // @link https://nextjs.org/docs/api-reference/next.config.js/rewrites
  async rewrites() {
    const res = [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/:path*`,
      },
    ];

    if (isProd) {
      const socketProxy = {
        source: '/socket/:path*',
        destination: `http://localhost:${NEXTJS_SOCKET_PORT}/socket/:path*`,
      };
      res.push(socketProxy);
    }

    return res;
  },

  // @link https://nextjs.org/docs/api-reference/next.config.js/headers
  async headers() {
    return [
      // {
      //   // All page routes, not the api ones
      //   source: '/:path((?!api).*)*',
      //   headers: [
      //     ...secureHeaders,
      //     { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      //     { key: 'Cross-Origin-Embedder-Policy', value: 'same-origin' },
      //   ],
      // },
    ];
  },

  env: {
    APP_NAME: packageJson.name ?? 'not-in-package.json',
    APP_VERSION: packageJson.version ?? 'not-in-package.json',
    BUILD_TIME: new Date().toISOString(),
  },
};

let config = nextConfig;

if (tmModules.length > 0) {
  console.info(`${pc.green('notice')}- Will transpile [${tmModules.join(',')}]`);
  const withNextTranspileModules = require('next-transpile-modules');

  config = withNextTranspileModules(tmModules, {
    resolveSymlinks: true,
    debug: false,
  })(config);
}

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer');
  config = withBundleAnalyzer({
    enabled: true,
  })(config);
}

module.exports = config;
