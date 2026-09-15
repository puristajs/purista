import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
	},
	test: {
		environment: 'jsdom',
		include: ['ui/src/**/*.test.tsx'],
		setupFiles: [fileURLToPath(new URL('./src/test/setup.ts', import.meta.url))],
	},
})
