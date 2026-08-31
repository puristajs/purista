import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	base: '/',
	root: fileURLToPath(new URL('.', import.meta.url)),
	plugins: [react()],
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
})
