/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild')
// Automatically exclude all node_modules from the bundled version
const { nodeExternalsPlugin } = require('esbuild-node-externals')

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: './lib/esm/index.mjs',
    bundle: true,
    format: 'esm',
    splitting: false,
    platform: 'node',
    sourcemap: true,
    target: 'node16',
    plugins: [nodeExternalsPlugin()],
    minify: true,
  })
  .catch(() => process.exit(1))

esbuild
  .build({
    entryPoints: ['./src/index.ts'],
    outfile: './lib/cjs/index.cjs',
    bundle: true,
    format: 'cjs',
    splitting: false,
    platform: 'node',
    sourcemap: true,
    target: 'node16',
    plugins: [nodeExternalsPlugin()],
    minify: true,
  })
  .catch(() => process.exit(1))
