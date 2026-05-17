import { defineConfig } from 'vitest/config'
import { getPuristaWorkspaceAliases } from '../../vitest.workspaceAliases.js'

export default defineConfig({
	resolve: {
		alias: getPuristaWorkspaceAliases(),
	},
	test: {
		globals: true,
		watch: false,
		environment: 'node',
		coverage: {
			enabled: true,
			include: ['**/src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		},
	},
})
