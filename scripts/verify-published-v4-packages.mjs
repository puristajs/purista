#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDirectory = dirname(fileURLToPath(import.meta.url))
const workspaceRoot = resolve(scriptDirectory, '../..')
export const registry = 'https://registry.npmjs.org'
export const releaseMetadata = Object.freeze({
	ticket: 'H4-020',
	acceptedCommit: 'be16a244cfbc89e7120b5a61cb08478e35b70e62',
	version: '4.0.0',
	sourceContentDigest: 'sha256:1ee4145d95b4c51c1db7d670fc8f41c2f5e3ad8224d77235e58598523b8b0fd6',
})

export class RegistryDiagnostic extends Error {
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
	throw new RegistryDiagnostic(code, fields)
}
const diagnosticOf = error =>
	error instanceof RegistryDiagnostic
		? error.toJSON()
		: { code: 'REGISTRY_UNEXPECTED_FAILURE', message: String(error).slice(0, 240) }
const readManifest = path => JSON.parse(readFileSync(path, 'utf8'))

export function collectPublicPackages(root) {
	const workspace = join(root, 'packages')
	const workspaceManifests = readdirSync(workspace).map(name => join(workspace, name, 'package.json'))
	const nativeRoot = join(workspace, 'harness-guardrails-native-privacy', 'npm')
	const nativeManifests = readdirSync(nativeRoot).map(name => join(nativeRoot, name, 'package.json'))
	return selectPublicPackages(
		[...workspaceManifests].concat(nativeManifests).map(path => ({ path, ...readManifest(path) })),
	)
}

export function selectPublicPackages(manifests) {
	return manifests
		.filter(manifest => manifest.private !== true && manifest.name?.startsWith('@purista/harness'))
		.sort((left, right) => left.name.localeCompare(right.name))
}

export function validateManifestInventory(manifests, version) {
	const names = new Set()
	for (const manifest of manifests) {
		if (!manifest.name || names.has(manifest.name))
			fail('MANIFEST_INVENTORY_INVALID', { reason: 'duplicate_name', name: manifest.name })
		if (manifest.version !== version)
			fail('MANIFEST_INVENTORY_INVALID', {
				reason: 'version',
				name: manifest.name,
				version: manifest.version,
				expectedVersion: version,
			})
		if (manifest.publishConfig?.access !== 'public')
			fail('MANIFEST_INVENTORY_INVALID', { reason: 'publish_access', name: manifest.name })
		names.add(manifest.name)
	}
	if (names.size !== 26)
		fail('MANIFEST_INVENTORY_INVALID', { reason: 'expected_26_public_packages', count: names.size })
	return [...names].sort()
}

const expectedTarball = (name, version) =>
	`${registry}/${encodeURIComponent(name)}/-/${name.split('/').at(-1)}-${version}.tgz`

export function isExpectedTarball(name, version, tarball) {
	if (typeof tarball !== 'string') return false

	try {
		const url = new URL(tarball)
		const expectedPath = `/${name}/-/${name.split('/').at(-1)}-${version}.tgz`
		return (
			url.protocol === 'https:' &&
			url.origin === registry &&
			url.search === '' &&
			url.hash === '' &&
			decodeURIComponent(url.pathname) === expectedPath
		)
	} catch {
		return false
	}
}

export function isSha512Integrity(integrity) {
	if (typeof integrity !== 'string' || !/^sha512-[A-Za-z0-9+/]+={0,2}$/.test(integrity)) return false
	return Buffer.from(integrity.slice('sha512-'.length), 'base64').length === 64
}

export function validatePackument(name, version, packument) {
	if (!packument || typeof packument !== 'object') fail('REGISTRY_JSON_MALFORMED', { package: name })
	const release = packument.versions?.[version]
	if (!release) fail('REGISTRY_VERSION_MISSING', { package: name, version })
	if (packument.name !== name || release.name !== name || release.version !== version)
		fail('REGISTRY_IDENTITY_INVALID', { package: name, version })
	if (packument.private === true || release.private === true) fail('REGISTRY_PRIVATE_PACKAGE', { package: name })
	const tarball = release.dist?.tarball
	if (!isExpectedTarball(name, version, tarball)) {
		fail('REGISTRY_TARBALL_INVALID', { package: name, tarball, expectedTarball: expectedTarball(name, version) })
	}
	if (!isSha512Integrity(release.dist?.integrity)) fail('REGISTRY_INTEGRITY_INVALID', { package: name })
	return { name, version, tarball, integrity: release.dist.integrity }
}

export async function fetchPackument(name, fetchImpl) {
	let response
	try {
		response = await fetchImpl(`${registry}/${encodeURIComponent(name)}`)
	} catch (error) {
		fail('REGISTRY_NETWORK_FAILURE', { package: name, message: String(error).slice(0, 240) })
	}
	if (!response.ok) fail('REGISTRY_PACKAGE_MISSING', { package: name, status: response.status })
	let body
	try {
		body = await response.text()
	} catch (error) {
		fail('REGISTRY_NETWORK_FAILURE', { package: name, message: String(error).slice(0, 240) })
	}
	try {
		return JSON.parse(body)
	} catch {
		fail('REGISTRY_JSON_MALFORMED', { package: name })
	}
}

export async function aggregateRegistry(names, version, fetchImpl) {
	const sorted = [...names].sort()
	if (new Set(sorted).size !== sorted.length) fail('MANIFEST_INVENTORY_INVALID', { reason: 'duplicate_name' })
	const results = await Promise.all(
		sorted.map(async name => {
			try {
				return { name, evidence: validatePackument(name, version, await fetchPackument(name, fetchImpl)) }
			} catch (error) {
				return { name, error: diagnosticOf(error) }
			}
		}),
	)
	const missing = results.filter(result => result.error).map(result => ({ package: result.name, error: result.error }))
	if (missing.length) fail('REGISTRY_CHECK_FAILED', { missing })
	return results.map(result => result.evidence)
}

export function validateEvidenceBinding(evidence, { verifiedAt, release } = {}) {
	if (
		typeof verifiedAt !== 'string' ||
		Number.isNaN(Date.parse(verifiedAt)) ||
		new Date(verifiedAt).toISOString() !== verifiedAt
	)
		fail('EVIDENCE_TIMESTAMP_INVALID')
	if (
		!release ||
		Object.keys(release).length !== Object.keys(releaseMetadata).length ||
		Object.entries(releaseMetadata).some(([key, value]) => release[key] !== value)
	)
		fail('EVIDENCE_RELEASE_INVALID')
	if (evidence.some(item => item.version !== release.version)) fail('EVIDENCE_RELEASE_INVALID')
}

export function formatEvidence(evidence, dependencies) {
	if (JSON.stringify(evidence.map(item => item.name)) !== JSON.stringify([...evidence.map(item => item.name)].sort()))
		fail('EVIDENCE_NOT_SORTED')
	validateEvidenceBinding(evidence, dependencies)
	return `${JSON.stringify(
		{ registry, release: dependencies.release, verifiedAt: dependencies.verifiedAt, packages: evidence },
		null,
		2,
	)}\n`
}

export function parseArgs(args) {
	if (
		args.length !== 4 ||
		args[0] !== '--workspace' ||
		args[1] !== 'ai-harness' ||
		args[2] !== '--version' ||
		args[3] !== '4.0.0'
	)
		fail('ARGUMENT_INVALID', { required: '--workspace ai-harness --version 4.0.0' })
	return { workspace: 'ai-harness', version: '4.0.0' }
}

export async function runVerification({ args, root, fetchImpl, now, release }) {
	const { version } = parseArgs(args)
	const names = validateManifestInventory(collectPublicPackages(join(root, 'ai-harness')), version)
	const packages = await aggregateRegistry(names, version, fetchImpl)
	return formatEvidence(packages, { release, verifiedAt: now().toISOString() })
}

async function main() {
	process.stdout.write(
		await runVerification({
			args: process.argv.slice(2),
			root: workspaceRoot,
			fetchImpl: fetch,
			now: () => new Date(),
			release: releaseMetadata,
		}),
	)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
	main().catch(error => {
		process.stderr.write(`${JSON.stringify(diagnosticOf(error))}\n`)
		process.exitCode = 1
	})
