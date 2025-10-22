/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {},
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  // ---- SVGR via webpack (build padrão e compatível no Next) ----
  webpack(config) {
    // 1) Tira .svg do loader padrão de arquivos
    const fileLoaderRule = config.module.rules.find(
      rule => rule && rule.test && rule.test.test && rule.test.test('.svg'),
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // 2) Usa SVGR para importar .svg como componente React
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgo: true,
            svgoConfig: { plugins: [{ name: 'removeViewBox', active: false }] },
            titleProp: true,
          },
        },
      ],
    });

    // 3) Opcional: permitir import URL: import url from './icon.svg?url'
    config.module.rules.push({
      test: /\.svg$/i,
      resourceQuery: /url/,
      type: 'asset/resource',
    });

    return config;
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
              svgo: true,
              svgoConfig: {
                plugins: [{ name: 'removeViewBox', active: false }],
              },
              titleProp: true,
            },
          },
        ],
        // Renderiza como JS (componente React)
        as: '*.js',
      },
    },
  },
};

module.exports = nextConfig;
