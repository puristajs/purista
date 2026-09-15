import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const manifestUrl = new URL('../package.json', import.meta.url)
const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'))

assert.equal(manifest.devDependencies?.ai, '^7.0.0', 'devDependencies.ai must be exactly ^7.0.0')

for (const sectionName of ['dependencies', 'optionalDependencies', 'peerDependencies']) {
	const dependencies = manifest[sectionName] ?? {}
	assert.equal(dependencies.ai, undefined, `ai must not appear in ${sectionName}`)
	for (const dependencyName of Object.keys(dependencies)) {
		assert.equal(
			dependencyName.startsWith('@purista/harness'),
			false,
			`${dependencyName} must not appear in ${sectionName}`,
		)
	}
}
