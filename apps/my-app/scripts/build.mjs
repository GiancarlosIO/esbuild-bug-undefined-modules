// import path from 'path';
// import { fileURLToPath } from 'url';
import { createRequire } from 'node:module';

import * as esbuild from 'esbuild';

import { esbuildServerProxy } from './dev-proxy.mjs';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const require = createRequire(import.meta.url);
const isProduction = process.env.NODE_ENV === 'production';

const options = {
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outfile: './dist/app.min.js',
  target: ['chrome64', 'edge79', 'firefox67', 'opera51', 'safari12'],
  alias: {
    // '@': './src',
    stream: require.resolve('stream-browserify'),
  },
  define: {
    global: 'window',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY': JSON.stringify(
      process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY || '',
    ),
  },
};

if (isProduction) {
  await esbuild.build({
    ...options,
    entryNames: '[dir]/[name]-[hash]',
    minify: true,
  });
} else {
  const ctx = await esbuild.context({
    ...options,
    sourcemap: true,
    color: true,
    logLevel: 'info',
  });

  // live reload implementation
  await ctx.watch();
  const servedir = './dist';
  const { port, host } = await ctx.serve({ servedir });
  esbuildServerProxy({ host, port, servedir });
  console.log(`> Devserver is running in: http://${host}:3000`)
  console.log(`> Url with the bug is: http://${host}:3000/legals/terminos-y-condiciones`)
}
