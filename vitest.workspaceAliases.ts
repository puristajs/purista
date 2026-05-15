import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = resolve(rootDir, 'packages')

export const getPuristaWorkspaceAliases = () => ({
	...Object.fromEntries(
		readdirSync(packagesDir, { withFileTypes: true })
			.filter(entry => entry.isDirectory())
			.map(entry => [entry.name, resolve(packagesDir, entry.name, 'src/index.ts')] as const)
			.filter(([, entryPath]) => existsSync(entryPath))
			.map(([name, entryPath]) => [`@purista/${name}`, entryPath]),
	),
})
