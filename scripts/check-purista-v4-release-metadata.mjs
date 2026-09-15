#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const EXPECTED_VERSION = '4.0.0'
export const EXPECTED_COUNTS = Object.freeze({ manifests: 36, versions: 21, jsr: 18, edges: 23 })
export const NPM_REGISTRY = 'https://registry.npmjs.org'

export class MetadataDiagnostic extends Error {
	constructor(code, fields = {}) {
		super(code)
		this.code = code
		this.fields = fields
	}
	toJSON() {
		return { code: this.code, ...this.fields }
	}
}

const fail = (code, fields) => {
	throw new MetadataDiagnostic(code, fields)
}
const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
const dirsWithManifest = (root, directory) => {
	const absolute = join(root, directory)
	if (!existsSync(absolute)) return []
	return readdirSync(absolute, { withFileTypes: true })
		.filter(entry => entry.isDirectory() && existsSync(join(absolute, entry.name, 'package.json')))
		.map(entry => join(absolute, entry.name))
}
const item = (root, path) => ({ path, relativePath: relative(root, path).replaceAll('\\', '/') })

export function collectReleaseManifests(root) {
	const paths = [
		join(root, 'package.json'),
		...dirsWithManifest(root, 'packages').map(dir => join(dir, 'package.json')),
		...dirsWithManifest(root, 'examples').map(dir => join(dir, 'package.json')),
	]
	const web = join(root, 'web', 'package.json')
	if (existsSync(web)) paths.push(web)
	return paths
		.filter(existsSync)
		.sort()
		.map(path => ({ ...item(root, path), manifest: readJson(path) }))
}

export function collectVersionFiles(root) {
	return dirsWithManifest(root, 'packages')
		.map(dir => join(dir, 'src', 'version.ts'))
		.filter(existsSync)
		.sort()
		.map(path => ({ ...item(root, path), source: readFileSync(path, 'utf8') }))
}

export function collectJsrManifests(root) {
	return dirsWithManifest(root, 'packages')
		.map(dir => join(dir, 'jsr.json'))
		.filter(existsSync)
		.sort()
		.map(path => ({ ...item(root, path), manifest: readJson(path) }))
}

const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const isPublicInternalDependency = name => name.startsWith('@purista/') || name.startsWith('@harness/')

export function collectDependencyEdges(root) {
	return dirsWithManifest(root, 'packages')
		.flatMap(dir => {
			const path = join(dir, 'package.json')
			const manifest = readJson(path)
			return dependencyFields.flatMap(field =>
				Object.entries(manifest[field] ?? {})
					.filter(([dependency]) => isPublicInternalDependency(dependency))
					.map(([dependency, range]) => ({
						packageName: manifest.name,
						dependency,
						range,
						field,
						path,
						relativePath: relative(root, path).replaceAll('\\', '/'),
					})),
			)
		})
		.sort((left, right) =>
			`${left.packageName}:${left.dependency}`.localeCompare(`${right.packageName}:${right.dependency}`),
		)
}

export function validateDependencyEdges(
	edges,
	{ expectedCount = EXPECTED_COUNTS.edges, version = EXPECTED_VERSION } = {},
) {
	if (edges.length !== expectedCount) fail('DEPENDENCY_EDGE_INVENTORY_INVALID', { expectedCount, count: edges.length })
	const expectedRange = `^${version}`
	for (const edge of edges) {
		if (edge.range !== expectedRange) fail('DEPENDENCY_EDGE_INVALID', { ...edge, expectedRange })
	}
	return edges
}

export function validateMetadata(root, { expectedVersion = EXPECTED_VERSION, expectedCounts = EXPECTED_COUNTS } = {}) {
	const manifests = collectReleaseManifests(root)
	const versions = collectVersionFiles(root)
	const jsr = collectJsrManifests(root)
	const edges = collectDependencyEdges(root)
	if (manifests.length !== expectedCounts.manifests)
		fail('MANIFEST_INVENTORY_INVALID', { expected: expectedCounts.manifests, count: manifests.length })
	if (versions.length !== expectedCounts.versions)
		fail('VERSION_INVENTORY_INVALID', { expected: expectedCounts.versions, count: versions.length })
	if (jsr.length !== expectedCounts.jsr)
		fail('JSR_INVENTORY_INVALID', { expected: expectedCounts.jsr, count: jsr.length })
	for (const { relativePath, manifest } of manifests) {
		if (manifest.version !== expectedVersion)
			fail('MANIFEST_METADATA_INVALID', { relativePath, version: manifest.version, expectedVersion })
	}
	for (const { relativePath, source } of versions) {
		const match = source.match(/export\s+const\s+puristaVersion\s*=\s*['"]([^'"]+)['"]\s*;?/)
		if (!match || match[1] !== expectedVersion)
			fail('VERSION_ARTIFACT_INVALID', { relativePath, version: match?.[1], expectedVersion })
	}
	for (const { relativePath, manifest } of jsr) {
		if (manifest.version !== expectedVersion)
			fail('JSR_METADATA_INVALID', { relativePath, version: manifest.version, expectedVersion })
	}
	validateDependencyEdges(edges, { expectedCount: expectedCounts.edges, version: expectedVersion })
	return {
		version: expectedVersion,
		counts: { manifests: manifests.length, versions: versions.length, jsr: jsr.length, edges: edges.length },
		manifests,
		versions,
		jsr,
		edges,
	}
}

const harnessPackageName = key => key.split('node_modules/').at(-1)
const isHarnessFamily = name => /^@purista\/harness(?:-|$)/.test(name)

export function collectHarnessLockPackages(lock) {
	return Object.entries(lock?.packages ?? {})
		.filter(([key]) => isHarnessFamily(harnessPackageName(key)))
		.map(([key, packageEntry]) => ({ key, name: harnessPackageName(key), packageEntry }))
}

export function validateLockfile(root, { expectedVersion = EXPECTED_VERSION, registry = NPM_REGISTRY } = {}) {
	const path = join(root, 'package-lock.json')
	if (!existsSync(path)) fail('LOCKFILE_INVALID', { reason: 'missing', path: 'package-lock.json' })
	let lock
	try {
		lock = readJson(path)
	} catch {
		fail('LOCKFILE_INVALID', { reason: 'malformed', path: 'package-lock.json' })
	}
	if (lock.lockfileVersion !== 3)
		fail('LOCKFILE_INVALID', { reason: 'lockfile_version', lockfileVersion: lock.lockfileVersion })
	if (lock.version !== expectedVersion)
		fail('LOCKFILE_INVALID', { reason: 'root_version', version: lock.version, expectedVersion })
	const packages = collectHarnessLockPackages(lock)
	if (!packages.length) fail('LOCKFILE_INVALID', { reason: 'harness_packages_missing' })
	const declared = new Set()
	for (const { manifest } of collectReleaseManifests(root)) {
		for (const field of dependencyFields)
			for (const name of Object.keys(manifest[field] ?? {})) if (isHarnessFamily(name)) declared.add(name)
	}
	const lockedNames = new Set(packages.map(item => item.name))
	for (const name of [...declared].sort()) if (!lockedNames.has(name)) fail('LOCK_PACKAGE_MISSING', { name })
	for (const { key, name, packageEntry } of packages) {
		if (packageEntry.version !== expectedVersion)
			fail('LOCK_PACKAGE_INVALID', { key, name, reason: 'version', version: packageEntry.version, expectedVersion })
		let url
		try {
			url = new URL(packageEntry.resolved)
		} catch {
			fail('LOCK_PACKAGE_INVALID', { key, name, reason: 'resolved' })
		}
		const expectedPath = `/${name}/-/${name.split('/').at(-1)}-${expectedVersion}.tgz`
		if (
			url.protocol !== 'https:' ||
			url.origin !== registry ||
			url.search ||
			url.hash ||
			decodeURIComponent(url.pathname) !== expectedPath
		)
			fail('LOCK_PACKAGE_INVALID', { key, name, reason: 'resolved', resolved: packageEntry.resolved })
		if (
			typeof packageEntry.integrity !== 'string' ||
			!/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(packageEntry.integrity) ||
			Buffer.from(packageEntry.integrity.slice('sha512-'.length), 'base64').length !== 64
		)
			fail('LOCK_PACKAGE_INVALID', { key, name, reason: 'integrity' })
	}
	for (const { relativePath, manifest } of collectReleaseManifests(root)) {
		const workspace = relativePath === 'package.json' ? '' : relativePath.slice(0, -'/package.json'.length)
		const entry = lock.packages?.[workspace]
		if (!entry) fail('LOCK_WORKSPACE_MISSING', { workspace: relativePath })
		if (entry.version !== manifest.version)
			fail('LOCK_WORKSPACE_INVALID', {
				workspace: relativePath,
				version: entry.version,
				expectedVersion: manifest.version,
			})
	}
	return {
		lockfileVersion: lock.lockfileVersion,
		harnessPackages: packages.length,
		packageNames: packages.map(item => item.name).sort(),
	}
}

export const validateRegistryLock = validateLockfile

export function parseArgs(args) {
	if (args.length === 0) return { metadataOnly: false }
	if (args.length === 1 && args[0] === '--metadata-only') return { metadataOnly: true }
	fail('ARGUMENT_INVALID', { accepted: ['', '--metadata-only'] })
}

export function diagnosticOf(error) {
	return error instanceof MetadataDiagnostic
		? error.toJSON()
		: { code: 'METADATA_UNEXPECTED_FAILURE', message: String(error).slice(0, 240) }
}

export function runCheck({ args, root, expectedCounts = EXPECTED_COUNTS } = {}) {
	const { metadataOnly } = parseArgs(args)
	const metadata = validateMetadata(root, { expectedCounts })
	const lock = metadataOnly ? undefined : validateLockfile(root)
	return { version: metadata.version, counts: metadata.counts, metadataOnly, lock }
}

const scriptPath = fileURLToPath(import.meta.url)
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
	try {
		const result = runCheck({ args: process.argv.slice(2), root: resolve(dirname(scriptPath), '..') })
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
	} catch (error) {
		process.stderr.write(`${JSON.stringify(diagnosticOf(error))}\n`)
		process.exitCode = 1
	}
}
