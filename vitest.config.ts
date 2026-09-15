import { configDefaults, defineConfig } from 'vitest/config'
import { getPuristaWorkspaceAliases } from './vitest.workspaceAliases.js'

export default defineConfig({
	resolve: {
		alias: getPuristaWorkspaceAliases(),
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
			exclude: ['examples/**', 'packages/cli/**'],
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
		exclude: [
			...configDefaults.exclude,
			'**/node_modules/**',
			'**/dist/**',
			'**/banking/chapters/**',
			'**/banking/baselines/**',
		],
	},
})
