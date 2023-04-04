module.exports = function (api, options) {
  api.cache(true);
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  }
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isProduction = env === 'production';
  const isTest = env === 'test';
  const isDevelopment = env === 'development';
  // const isLib = options.buildType === 'lib';
  const isLambdas = options.buildType === 'lambddas';
  const isWeb = options.buildType === 'web';
  const presetReactOptions = options.presetReactOptions || {};
  const presetEnvOptions = options.presetEnvOptions || {};
  const { usesRecharts, disableImportGraphqlPlugin } = options;

  const getTargets = () => {
    if (isProduction) {
      return [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie < 9',
        'ios_saf >= 9',
        'safari >= 9',
      ];
    }

    return [
      'last 2 chrome versions',
      'last 2 firefox versions',
      'last 2 edge versions',
    ];
  };

  return {
    // "assumptions": {

    // },
    presets: [
      isTest && [
        require('@babel/preset-env').default,
        {
          targets: { node: 'current' },
          loose: true,
        },
      ],
      (isProduction || isDevelopment) && [
        require('@babel/preset-env').default,
        {
          targets: getTargets(),
          // set to false when we are building web apps
          // Webpack supports ES Modules out of the box and therefore doesn’t require
          // import/export to be transpiled resulting in smaller builds, and better tree
          // shaking. See https://webpack.js.org/guides/tree-shaking/#conclusion
          modules: isWeb ? false : 'commonjs',
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: 'entry',
          // Set the corejs version we are using to avoid warnings in console
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ['transform-typeof-symbol'],
          loose: false,
          ...presetEnvOptions,
        },
      ],
      [
        require('@babel/preset-react').default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isDevelopment || isTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
          // Use the new react/react-jsx transform
          runtime: 'automatic',
          ...presetReactOptions,
        },
      ],
      [require('@babel/preset-typescript').default],
    ].filter(Boolean),
    plugins: [
      isTest && require('@babel/plugin-transform-modules-commonjs'),
      isTest && require('babel-plugin-dynamic-import-node'),
      [
        require('babel-plugin-styled-components'),
        {
          displayName: !isProduction,
          preprocess: false,
          ssr: true,
          minify: false,
          pure: isProduction,
        },
      ],
      // web apps will use graphql-loader
      !isWeb &&
        !disableImportGraphqlPlugin &&
        !isTest &&
        require('babel-plugin-import-graphql'),
      [
        require('@babel/plugin-proposal-private-methods').default,
        {
          loose: true,
        },
      ],
      [
        require('@babel/plugin-proposal-private-property-in-object').default,
        {
          loose: true,
        },
      ],
      require('@babel/plugin-proposal-export-default-from'),
      [
        require('@babel/plugin-proposal-decorators').default,
        {
          legacy: true,
        },
      ],
      [
        require('@babel/plugin-proposal-class-properties'),
        {
          loose: true,
        },
      ],
      // default module alias for libraries
      // remember to also configurate the @zerollup/ts-transform-paths package in your tsconfig
      !isWeb && [
        require('babel-plugin-module-resolver'),
        {
          root: ['./src'],
          alias: {
            '@': './src',
          },
        },
      ],
      require('@babel/plugin-syntax-dynamic-import'),
      require('@babel/plugin-proposal-nullish-coalescing-operator'),
      require('@babel/plugin-proposal-optional-chaining'),
      require('babel-plugin-macros'),
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
        },
      ],
      isLambdas && require('babel-plugin-source-map-support'),
      isProduction && require('babel-plugin-annotate-pure-calls'),
      isProduction &&
        require('@babel/plugin-transform-react-constant-elements').default,
      isProduction && require('babel-plugin-transform-react-remove-prop-types'),
      isProduction &&
        isWeb &&
        require('@babel/plugin-transform-react-inline-elements').default,
      isProduction && [
        require('babel-plugin-transform-remove-console'),
        { exclude: ['error', 'warn'] },
      ],
      isProduction && require('babel-plugin-transform-remove-debugger'),
      isProduction && require('babel-plugin-lodash'),
      usesRecharts && isProduction && require('babel-plugin-recharts'),
    ].filter(Boolean),
  };
};
