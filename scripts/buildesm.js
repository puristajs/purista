/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild')

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
    minify: true,
    packages: 'external',
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
    minify: true,
    packages: 'external',
  })
  .catch(() => process.exit(1))
