import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { buildPublishPlan, collectWorkspaces, publishWorkspaces } from './publishWorkspaces.mjs'

const makeWorkspace = async packages => {
	const root = await mkdtemp(path.join(os.tmpdir(), 'purista-publish-'))
	for (const [relativeDir, manifest] of Object.entries(packages)) {
		const directory = path.join(root, relativeDir)
		await mkdir(directory, { recursive: true })
		await writeFile(path.join(directory, 'package.json'), JSON.stringify(manifest, null, 2))
	}
	return root
}

test('publishes public workspaces in dependency-topological and deterministic order', async () => {
	const root = await makeWorkspace({
		'packages/zeta': { name: '@example/zeta', version: '1.0.0' },
		'packages/alpha': { name: '@example/alpha', version: '1.0.0', dependencies: { '@example/zeta': '^1.0.0' } },
		'packages/beta': { name: '@example/beta', version: '1.0.0', dependencies: { '@example/zeta': '^1.0.0' } },
	})
	try {
		const packages = await collectWorkspaces(root)
		assert.deepEqual(
			buildPublishPlan(packages).map(pkg => pkg.name),
			['@example/zeta', '@example/alpha', '@example/beta'],
		)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('excludes manifestless directories and private workspaces', async () => {
	const root = await makeWorkspace({
		'packages/public': { name: '@example/public', version: '1.0.0' },
		'packages/private': { name: '@example/private', version: '1.0.0', private: true },
	})
	await mkdir(path.join(root, 'packages', 'manifestless'), { recursive: true })
	try {
		const packages = await collectWorkspaces(root)
		assert.deepEqual(
			packages.map(pkg => pkg.name),
			['@example/private', '@example/public'],
		)
		assert.deepEqual(
			buildPublishPlan(packages).map(pkg => pkg.name),
			['@example/public'],
		)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('rejects missing internal dependency targets and cycles', async () => {
	const missingRoot = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0', dependencies: { '@example/missing': '^1.0.0' } },
	})
	try {
		const packages = await collectWorkspaces(missingRoot)
		assert.throws(() => buildPublishPlan(packages), /missing internal dependency target.*@example\/missing/)
	} finally {
		await rm(missingRoot, { recursive: true, force: true })
	}

	const cycleRoot = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0', dependencies: { '@example/b': '^1.0.0' } },
		'packages/b': { name: '@example/b', version: '1.0.0', dependencies: { '@example/a': '^1.0.0' } },
	})
	try {
		const packages = await collectWorkspaces(cycleRoot)
		assert.throws(() => buildPublishPlan(packages), /dependency cycle/)
	} finally {
		await rm(cycleRoot, { recursive: true, force: true })
	}
})

test('rejects invalid internal dependency targets', async () => {
	const root = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0', dependencies: { '@example/b': 'workspace:*' } },
		'packages/b': { name: '@example/b', version: '1.0.0' },
	})
	try {
		const packages = await collectWorkspaces(root)
		assert.throws(() => buildPublishPlan(packages), /invalid internal dependency range.*workspace:\*/)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('validates the cross-repository Harness range', async () => {
	const root = await makeWorkspace({
		'packages/a': {
			name: '@example/a',
			version: '1.0.0',
			dependencies: {
				'@purista/harness': '^4.0.0',
				'@purista/harness-openai-adapter': 'latest',
			},
		},
	})
	try {
		const packages = await collectWorkspaces(root)
		assert.throws(() => buildPublishPlan(packages), /invalid internal dependency range.*latest/)
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('dry-run is safe and does not query the registry or publish', async () => {
	const root = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0' },
	})
	try {
		const calls = []
		const result = await publishWorkspaces({
			root,
			dryRun: true,
			run: async (command, options) => calls.push({ command, options }),
		})
		assert.deepEqual(result.published, [])
		assert.deepEqual(result.skipped, [])
		assert.deepEqual(
			result.plan.map(pkg => pkg.name),
			['@example/a'],
		)
		assert.deepEqual(calls, [
			{
				command: ['npm', 'publish', '--access', 'public', '--dry-run', '--json'],
				options: { cwd: path.join(root, 'packages/a') },
			},
		])
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('dry-run packs each package in dependency order', async () => {
	const root = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0' },
		'packages/b': { name: '@example/b', version: '1.0.0', dependencies: { '@example/a': '^1.0.0' } },
	})
	try {
		const calls = []
		await publishWorkspaces({ root, dryRun: true, run: async (command, options) => calls.push({ command, options }) })
		assert.deepEqual(
			calls.map(({ options }) => path.basename(options.cwd)),
			['a', 'b'],
		)
		assert.ok(calls.every(({ command }) => command.join(' ') === 'npm publish --access public --dry-run --json'))
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})

test('skips exact versions already published', async () => {
	const root = await makeWorkspace({
		'packages/a': { name: '@example/a', version: '1.0.0' },
		'packages/b': { name: '@example/b', version: '1.0.0', dependencies: { '@example/a': '^1.0.0' } },
	})
	try {
		const calls = []
		const result = await publishWorkspaces({
			root,
			registry: 'https://registry.example.test',
			view: async pkg => (pkg.name === '@example/a' ? '1.0.0' : null),
			run: async (command, options) => calls.push({ command, options }),
		})
		assert.deepEqual(result.skipped, ['@example/a'])
		assert.deepEqual(result.published, ['@example/b'])
		assert.equal(calls.length, 1)
		assert.match(calls[0].command.join(' '), /npm publish/)
		assert.equal(calls[0].options.cwd, path.join(root, 'packages/b'))
	} finally {
		await rm(root, { recursive: true, force: true })
	}
})
