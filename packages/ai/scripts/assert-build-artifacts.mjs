import { access } from 'node:fs/promises'
import process from 'node:process'

const requiredArtifacts = ['dist/esm/index.js', 'dist/commonjs/index.js']

const checkArtifacts = async () => {
	const missing = []
	for (const artifact of requiredArtifacts) {
		try {
			await access(new URL(`../${artifact}`, import.meta.url))
		} catch {
			missing.push(artifact)
		}
	}

	if (missing.length > 0) {
		const message = `Missing build artifacts: ${missing.join(', ')}`
		throw new Error(message)
	}
}

checkArtifacts().catch(error => {
	console.error(error instanceof Error ? error.message : String(error))
	process.exitCode = 1
})
