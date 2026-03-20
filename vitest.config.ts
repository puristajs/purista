import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@purista/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
			'@purista/ai': fileURLToPath(new URL('./packages/ai/src/index.ts', import.meta.url)),
		},
	},
	test: {
		isolate: false,
		globals: true,
		watch: false,
		environment: 'node',
		testTimeout: 30_000,
		hookTimeout: 30_000,
		coverage: {
			enabled: false,
			include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
			exclude: ['examples/**', 'packages/cli/**', 'website:/**'],
			thresholds: {
				lines: 63,
				functions: 63,
				branches: 74,
				statements: 63,
			},
		},
		include: [
			'**/test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
			'**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
		],
		exclude: [...configDefaults.exclude, '**/node_modules/**', '**/dist/**', '**/.tshy-build/**', 'website/**'],
	},
})
