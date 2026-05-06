import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
	esbuild: {
		jsx: 'automatic',
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/frontend'),
		},
	},
	test: {
		environment: 'jsdom',
		include: [resolve(__dirname, 'src/frontend/**/*.test.ts'), resolve(__dirname, 'src/frontend/**/*.test.tsx')],
	},
})
