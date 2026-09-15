#!/usr/bin/env node

import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url))
const roots = ['examples', 'web/src/content'].map(path => join(repositoryRoot, path))
const ignoredDirectories = new Set(['node_modules', 'dist', 'coverage', '.astro'])
const inspectedExtensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.md', '.mdx'])

async function files(directory) {
	const result = []
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		if (ignoredDirectories.has(entry.name)) continue
		const path = join(directory, entry.name)
		if (entry.isDirectory()) result.push(...(await files(path)))
		else result.push(path)
	}
	return result
}

async function readExampleReadme(directory) {
	const entry = (await readdir(directory)).find(name => name.toLowerCase() === 'readme.md')
	return entry ? readFile(join(directory, entry), 'utf8') : undefined
}

const failures = []
for (const root of roots) {
	for (const file of await files(root)) {
		if (!inspectedExtensions.has(extname(file))) continue
		const name = relative(repositoryRoot, file)
		const source = await readFile(file, 'utf8')

		if (
			!file.endsWith('package-lock.json') &&
			/PURISTA_TUTORIAL_REPOSITORY|file:vendor|@purista[^\s"']*\.tgz/.test(source)
		) {
			failures.push(`${name}: teaches or retains a local PURISTA package archive`)
		}
		if (/from\s+['"](?:\.\.\/)+packages\/.+\/src/.test(source)) {
			failures.push(`${name}: imports a PURISTA package through monorepo source`)
		}
		if (/(?:--workspace|-w)\s+(?:@purista\/|examples\/)/.test(source)) {
			failures.push(`${name}: requires a monorepo workspace command`)
		}

		if (file.endsWith('package.json')) {
			const manifest = JSON.parse(source)
			let usesPuristaPackage = false
			for (const field of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
				for (const [dependency, version] of Object.entries(manifest[field] ?? {})) {
					if (dependency.startsWith('@purista/')) {
						usesPuristaPackage = true
						if (version === '*' || /^(?:file|link|workspace):/.test(version)) {
							failures.push(`${name}: ${field}.${dependency} must use an explicit published package version`)
						}
					}
				}
			}
			if (usesPuristaPackage && name.startsWith('examples/')) {
				const readme = await readExampleReadme(dirname(file))
				if (!readme || !/\bnpm (?:install|ci)\b/.test(readme)) {
					failures.push(`${name}: example README must include npm install or npm ci`)
				}
			}
		}

		if (file.endsWith('package-lock.json')) {
			const lockfile = JSON.parse(source)
			for (const [path, entry] of Object.entries(lockfile.packages ?? {})) {
				if (!/^node_modules\/@purista\/[^/]+$/.test(path)) continue
				if (entry.resolved && !entry.resolved.startsWith('https://registry.npmjs.org/@purista/')) {
					failures.push(`${name}: ${path} does not resolve from the npm registry`)
				}
			}
		}
	}
}

assert.deepEqual(failures, [], `Public example installation violations:\n${failures.join('\n')}`)
process.stdout.write('Verified that public examples install PURISTA packages from npm.\n')
