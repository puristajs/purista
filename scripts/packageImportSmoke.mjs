#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageRoot = join(repoRoot, 'packages')

const packages = readdirSync(packageRoot)
	.map(name => join(packageRoot, name))
	.map(dir => ({ dir, manifest: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) }))
	.filter(({ manifest }) => manifest.private !== true && manifest.name?.startsWith('@purista/'))
	.sort((left, right) => left.manifest.name.localeCompare(right.manifest.name))

const coreSubpathChecks = [
	{ specifier: '@purista/core/testing', exports: ['createCommandTestHarness', 'safeBind'] },
	{ specifier: '@purista/core/client', exports: ['ClientBuilder', 'HttpClient'] },
	{ specifier: '@purista/core/adapter', exports: ['EventBridgeBaseClass', 'StateStoreBaseClass'] },
]

if (packages.length === 0) {
	throw new Error('No public @purista workspace packages found.')
}

const tempRoot = mkdtempSync(join(tmpdir(), 'purista-package-import-'))
const packDir = join(tempRoot, 'packs')
const consumerDir = join(tempRoot, 'consumer')
const npmCacheDir = join(tempRoot, 'npm-cache')
const npmEnv = { ...process.env, npm_config_cache: npmCacheDir }

try {
	mkdirSync(packDir, { recursive: true })
	mkdirSync(consumerDir, { recursive: true })
	mkdirSync(npmCacheDir, { recursive: true })

	const tarballs = packages.map(({ dir, manifest }) => {
		const output = execFileSync('npm', ['pack', '--json', '--pack-destination', packDir], {
			cwd: dir,
			env: npmEnv,
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
		env: npmEnv,
		stdio: 'inherit',
	})

	const importChecks = packages
		.map(
			({ manifest }) =>
				`await import(${JSON.stringify(manifest.name)});\nconsole.log(${JSON.stringify(manifest.name)});`,
		)
		.concat(
			coreSubpathChecks.map(
				check =>
					`{ const entry = await import(${JSON.stringify(check.specifier)}); for (const name of ${JSON.stringify(check.exports)}) { if (!(name in entry)) throw new Error(${JSON.stringify(check.specifier)} + ' is missing ' + name); } console.log(${JSON.stringify(check.specifier)}); }`,
			),
		)
		.join('\n')

	execFileSync(process.execPath, ['--input-type=module', '--eval', importChecks], {
		cwd: consumerDir,
		stdio: 'inherit',
	})

	process.stdout.write(
		`Package import smoke passed for ${packages.length} package(s) and ${coreSubpathChecks.length} Core subpath(s).\n`,
	)
} finally {
	rmSync(tempRoot, { force: true, recursive: true })
}
