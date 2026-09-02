import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		include: ['./src/**/*.test.tsx'],
	},
})
