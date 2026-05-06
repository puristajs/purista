import { resolve } from 'node:path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	root: resolve(__dirname, 'src/frontend'),
	plugins: [react(), tailwindcss()],
	server: {
		host: '0.0.0.0',
		port: 3000,
		strictPort: true,
		proxy: {
			'/api': {
				target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:3001',
				changeOrigin: true,
			},
		},
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/frontend'),
		},
	},
	build: {
		outDir: resolve(__dirname, 'public'),
		emptyOutDir: true,
	},
})
