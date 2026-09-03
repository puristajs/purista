import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
	},
	build: {
		outDir: fileURLToPath(new URL('../public', import.meta.url)),
		emptyOutDir: true,
	},
})
