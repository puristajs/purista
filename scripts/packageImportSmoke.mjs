#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = join(repoRoot, 'packages')

const extraPackageDirectories = (process.env.PURISTA_PACKAGE_SMOKE_EXTRA_PACKAGE_DIRS ?? '')
	.split(delimiter)
	.map(directory => directory.trim())
	.filter(Boolean)

const packages = [...readdirSync(packageRoot).map(name => join(packageRoot, name)), ...extraPackageDirectories]
	.filter(dir => existsSync(join(dir, 'package.json')))
	.map(dir => ({ dir, manifest: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) }))
	.filter(({ manifest }) => manifest.private !== true && manifest.name?.startsWith('@purista/'))
	.sort((left, right) => left.manifest.name.localeCompare(right.manifest.name))

if (packages.length === 0) {
	throw new Error('No public @purista workspace packages found.')
}

const tempRoot = mkdtempSync(join(tmpdir(), 'purista-package-import-'))
const packDir = join(tempRoot, 'packs')
const consumerDir = join(tempRoot, 'consumer')

try {
	mkdirSync(packDir, { recursive: true })
	mkdirSync(consumerDir, { recursive: true })

	const tarballs = packages.map(({ dir, manifest }) => {
		const output = execFileSync('npm', ['pack', '--json', '--pack-destination', packDir], {
			cwd: dir,
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'pipe'],
		})
		const [packed] = JSON.parse(output)
		if (!packed?.filename) {
			throw new Error(`npm pack did not report a tarball for ${manifest.name}`)
		}
		return join(packDir, packed.filename)
	})

	writeFileSync(join(consumerDir, 'package.json'), JSON.stringify({ private: true, type: 'module' }, null, 2))

	execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', ...tarballs], {
		cwd: consumerDir,
		stdio: 'inherit',
	})

	const importChecks = packages
		.map(
			({ manifest }) =>
				`await import(${JSON.stringify(manifest.name)});\nconsole.log(${JSON.stringify(manifest.name)});`,
		)
		.join('\n')

	execFileSync(process.execPath, ['--input-type=module', '--eval', importChecks], {
		cwd: consumerDir,
		stdio: 'inherit',
	})

	process.stdout.write(`Package import smoke passed for ${packages.length} package(s).\n`)
} finally {
	rmSync(tempRoot, { force: true, recursive: true })
}
