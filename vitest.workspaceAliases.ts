import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = resolve(rootDir, 'packages')

export const getPuristaWorkspaceAliases = () => ({
	'@purista/core/testing': resolve(packagesDir, 'core', 'src/testing/index.ts'),
	'@purista/core/client': resolve(packagesDir, 'core', 'src/client/index.ts'),
	'@purista/core/adapter': resolve(packagesDir, 'core', 'src/adapter/index.ts'),
	...Object.fromEntries(
		readdirSync(packagesDir, { withFileTypes: true })
			.filter(entry => entry.isDirectory())
			.map(entry => [entry.name, resolve(packagesDir, entry.name, 'src/index.ts')] as const)
			.filter(([, entryPath]) => existsSync(entryPath))
			.map(([name, entryPath]) => [`@purista/${name}`, entryPath]),
	),
})
