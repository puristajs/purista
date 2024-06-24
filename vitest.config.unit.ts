import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
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
		include: ['**/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: [
			...configDefaults.exclude,
			'**/test/**',
			'**/node_modules/**',
			'**/dist/**',
			'**/.tshy-build/**',
			'website/**',
		],
	},
})
