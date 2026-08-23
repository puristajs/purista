#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = join(repoRoot, 'packages')

const packages = readdirSync(packageRoot)
	.map(name => join(packageRoot, name))
	.map(dir => ({ dir, manifest: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) }))
	.filter(({ manifest }) => manifest.private !== true && manifest.name?.startsWith('@purista/'))
	.sort(({ manifest: left }, { manifest: right }) => left.name.localeCompare(right.name))

const coreIndex = packages.findIndex(({ manifest }) => manifest.name === '@purista/core')
if (coreIndex < 0) {
	throw new Error('Expected @purista/core to be a public workspace package.')
}

const [core] = packages.splice(coreIndex, 1)
for (const { manifest } of [core, ...packages]) {
	if (!manifest.scripts?.build) {
		throw new Error(`${manifest.name} is public but has no build script.`)
	}
	execFileSync('npm', ['run', 'build', '--workspace', manifest.name], {
		cwd: repoRoot,
		stdio: 'inherit',
	})
}

process.stdout.write(`Built ${packages.length + 1} public package(s).\n`)
