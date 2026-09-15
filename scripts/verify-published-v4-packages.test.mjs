import assert from 'node:assert/strict'
import { resolve } from 'node:path'

import {
	aggregateRegistry,
	collectPublicPackages,
	formatEvidence,
	isExpectedTarball,
	isSha512Integrity,
	parseArgs,
	releaseMetadata,
	runVerification,
	selectPublicPackages,
	validateEvidenceBinding,
	validateManifestInventory,
	validatePackument,
} from './verify-published-v4-packages.mjs'

const name = '@purista/harness'
const version = '4.0.0'
const integrity = `sha512-${Buffer.alloc(64, 1).toString('base64')}`
const tarball = 'https://registry.npmjs.org/%40purista%2Fharness/-/harness-4.0.0.tgz'
const packument = (packageName = name, packageVersion = version) => ({
	name: packageName,
	versions: {
		[version]: {
			name: packageName,
			version: packageVersion,
			dist: {
				tarball: `https://registry.npmjs.org/${encodeURIComponent(packageName)}/-/${packageName.split('/').at(-1)}-${packageVersion}.tgz`,
				integrity,
			},
		},
	},
})

const valid = packument()
const assertCode = (callback, code) => assert.throws(callback, error => error.code === code)

assert.deepEqual(parseArgs(['--workspace', 'ai-harness', '--version', '4.0.0']), { workspace: 'ai-harness', version })
for (const args of [
	[],
	['--workspace', 'purista', '--version', version],
	['--version', version, '--workspace', 'ai-harness'],
	['--workspace', 'ai-harness', '--version', '4.0.1'],
]) {
	assertCode(() => parseArgs(args), 'ARGUMENT_INVALID')
}

assert.equal(validatePackument(name, version, valid).tarball, tarball)
assert.equal(isExpectedTarball(name, version, tarball), true)
assert.equal(isExpectedTarball(name, version, 'https://registry.npmjs.org/@purista/harness/-/harness-4.0.0.tgz'), true)
assert.equal(isSha512Integrity(integrity), true)
assert.equal(isExpectedTarball(name, version, `${tarball}?cache=1`), false)
assert.equal(isExpectedTarball(name, version, `${tarball}#cached`), false)

const invalidPackuments = [
	[null, 'REGISTRY_JSON_MALFORMED'],
	[{ ...valid, name: '@purista/other' }, 'REGISTRY_IDENTITY_INVALID'],
	[
		{ ...valid, versions: { [version]: { ...valid.versions[version], name: '@purista/other' } } },
		'REGISTRY_IDENTITY_INVALID',
	],
	[
		{ ...valid, versions: { [version]: { ...valid.versions[version], version: '3.0.0' } } },
		'REGISTRY_IDENTITY_INVALID',
	],
	[{ name, versions: {} }, 'REGISTRY_VERSION_MISSING'],
	[{ ...valid, private: true }, 'REGISTRY_PRIVATE_PACKAGE'],
	[{ ...valid, versions: { [version]: { ...valid.versions[version], private: true } } }, 'REGISTRY_PRIVATE_PACKAGE'],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: { ...valid.versions[version].dist, tarball: 'file:package.tgz' },
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: {
						...valid.versions[version].dist,
						tarball: 'https://registry.npmjs.org/%40purista%2Fharness/-/purista-harness-4.0.0.tgz',
					},
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: { ...valid.versions[version].dist, tarball: 'copy:../package' },
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: { ...valid.versions[version], dist: { ...valid.versions[version].dist, tarball: 'workspace:*' } },
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: { ...valid.versions[version].dist, tarball: 'link:../package' },
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: { ...valid.versions[version].dist, tarball: 'https://cache.example/package.tgz' },
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: {
						...valid.versions[version].dist,
						tarball: 'https://registry.npmjs.org/%40purista%2Fother/-/other-4.0.0.tgz',
					},
				},
			},
		},
		'REGISTRY_TARBALL_INVALID',
	],
	[{ ...valid, versions: { [version]: { ...valid.versions[version], dist: {} } } }, 'REGISTRY_TARBALL_INVALID'],
	[
		{
			...valid,
			versions: {
				[version]: { ...valid.versions[version], dist: { ...valid.versions[version].dist, integrity: undefined } },
			},
		},
		'REGISTRY_INTEGRITY_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: { ...valid.versions[version], dist: { ...valid.versions[version].dist, integrity: 'sha256-bad' } },
			},
		},
		'REGISTRY_INTEGRITY_INVALID',
	],
	[
		{
			...valid,
			versions: {
				[version]: {
					...valid.versions[version],
					dist: { ...valid.versions[version].dist, integrity: 'sha512-YWJjZA==' },
				},
			},
		},
		'REGISTRY_INTEGRITY_INVALID',
	],
]
for (const [invalid, code] of invalidPackuments) assertCode(() => validatePackument(name, version, invalid), code)

const manifests = Array.from({ length: 26 }, (_, index) => ({
	name: `@purista/harness-${index}`,
	version,
	publishConfig: { access: 'public' },
}))
assert.equal(validateManifestInventory(manifests, version).length, 26)
assertCode(
	() => validateManifestInventory([...manifests, { name: '@purista/harness-extra', version }], version),
	'MANIFEST_INVENTORY_INVALID',
)
assertCode(() => validateManifestInventory(manifests.slice(1), version), 'MANIFEST_INVENTORY_INVALID')
assertCode(() => validateManifestInventory([...manifests, manifests[0]], version), 'MANIFEST_INVENTORY_INVALID')
assertCode(() => validateManifestInventory([{ name, version: '3.0.0' }], version), 'MANIFEST_INVENTORY_INVALID')
assertCode(
	() => validateManifestInventory([{ ...manifests[0], publishConfig: undefined }, ...manifests.slice(1)], version),
	'MANIFEST_INVENTORY_INVALID',
)
assertCode(
	() =>
		validateManifestInventory(
			[{ ...manifests[0], publishConfig: { access: 'restricted' } }, ...manifests.slice(1)],
			version,
		),
	'MANIFEST_INVENTORY_INVALID',
)
assert.deepEqual(
	selectPublicPackages([
		{ name, version, publishConfig: { access: 'public' } },
		{ name: '@purista/harness-private', version, private: true },
	]),
	[{ name, version, publishConfig: { access: 'public' } }],
)

const publicPackages = collectPublicPackages(resolve('..', 'ai-harness'))
assert.equal(publicPackages.length, 26)
assert.equal(validateManifestInventory(publicPackages, version).length, 26)

const response = packumentName => ({
	ok: true,
	status: 200,
	text: async () => JSON.stringify(packument(packumentName)),
})
const aggregate = await aggregateRegistry(['@purista/harness-b', '@purista/harness-a'], version, async url =>
	response(decodeURIComponent(url.split('/').at(-1))),
)
assert.deepEqual(
	aggregate.map(item => item.name),
	['@purista/harness-a', '@purista/harness-b'],
)
const dependencies = { release: releaseMetadata, verifiedAt: '2026-09-10T12:00:00.000Z' }
const formattedEvidence = formatEvidence(aggregate, dependencies)
assert.equal(formattedEvidence, formatEvidence([...aggregate], dependencies))
assert.deepEqual(JSON.parse(formattedEvidence).release, releaseMetadata)
assert.equal(JSON.parse(formattedEvidence).verifiedAt, dependencies.verifiedAt)
assertCode(
	() => validateEvidenceBinding(aggregate, { release: releaseMetadata, verifiedAt: 'not-a-date' }),
	'EVIDENCE_TIMESTAMP_INVALID',
)
assertCode(
	() =>
		validateEvidenceBinding(aggregate, {
			release: { ...releaseMetadata, ticket: 'forged' },
			verifiedAt: dependencies.verifiedAt,
		}),
	'EVIDENCE_RELEASE_INVALID',
)
assertCode(
	() => validateEvidenceBinding([{ ...aggregate[0], version: '4.0.1' }], dependencies),
	'EVIDENCE_RELEASE_INVALID',
)

const runEvidence = await runVerification({
	args: ['--workspace', 'ai-harness', '--version', version],
	root: resolve('..'),
	fetchImpl: async url => response(decodeURIComponent(url.split('/').at(-1))),
	now: () => new Date(dependencies.verifiedAt),
	release: releaseMetadata,
})
assert.equal(runEvidence, formatEvidence(JSON.parse(runEvidence).packages, dependencies))

for (const [fetchImpl, expectedCode] of [
	[async () => ({ ok: false, status: 404, text: async () => '' }), 'REGISTRY_PACKAGE_MISSING'],
	[async () => ({ ok: true, status: 200, text: async () => '{' }), 'REGISTRY_JSON_MALFORMED'],
	[
		async () => ({ ok: true, status: 200, text: async () => Promise.reject(new Error('socket closed')) }),
		'REGISTRY_NETWORK_FAILURE',
	],
	[
		async () => {
			throw new Error('offline')
		},
		'REGISTRY_NETWORK_FAILURE',
	],
]) {
	await assert.rejects(
		() => aggregateRegistry([name], version, fetchImpl),
		error => error.code === 'REGISTRY_CHECK_FAILED' && error.fields.missing[0].error.code === expectedCode,
	)
}

await assert.rejects(
	() => aggregateRegistry([name, name], version, async () => response(name)),
	error => error.code === 'MANIFEST_INVENTORY_INVALID',
)
await assert.rejects(
	() =>
		aggregateRegistry(['@purista/harness-z', '@purista/harness-a'], version, async packageUrl => {
			const packageName = decodeURIComponent(packageUrl.split('/').at(-1))
			return packageName.endsWith('-a') ? response(packageName) : { ok: false, status: 404, text: async () => '' }
		}),
	error =>
		error.code === 'REGISTRY_CHECK_FAILED' &&
		error.fields.missing[0].package === '@purista/harness-z' &&
		typeof error.fields.missing[0].error === 'object',
)
assertCode(() => formatEvidence([{ name: 'z' }, { name: 'a' }], dependencies), 'EVIDENCE_NOT_SORTED')

process.stdout.write('Published v4 registry verifier unit tests passed.\n')
