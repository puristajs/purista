import { build } from 'esbuild'

const b = () =>
	build({
		bundle: true,
		entryPoints: ['./src/bin.ts'],
		banner: {
			js: '#!/usr/bin/env node',
		},
		platform: 'node',
		outfile: 'dist/bin.cjs',
		format: 'cjs',
		minify: true,
	})

await Promise.all([b()])
