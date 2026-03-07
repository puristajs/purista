import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	root: resolve(__dirname, 'src/frontend'),
	plugins: [react()],
	build: {
		outDir: resolve(__dirname, 'public'),
		emptyOutDir: true,
	},
})
