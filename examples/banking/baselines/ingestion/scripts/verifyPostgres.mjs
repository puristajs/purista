import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { once } from 'node:events'

const compose = ['compose', '-f', 'compose.knowledge.yaml']
const databaseUrl = 'postgres://example_bank:local-example-password@127.0.0.1:55432/example_bank'

function docker(...args) {
	const result = spawnSync('docker', args, { encoding: 'utf8' })
	if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`)
}

async function runTests() {
	const candidates = [
		'src/resources/PgKnowledgeRepository.postgres.test.ts',
		'src/knowledgeIngestion.postgres.test.ts',
	].filter(existsSync)
	const child = spawn('npx', ['vitest', 'run', ...candidates], {
		env: { ...process.env, DATABASE_URL: databaseUrl },
		stdio: 'inherit',
	})
	const [code] = await once(child, 'close')
	if (code !== 0) throw new Error(`PostgreSQL tests failed with exit code ${code}`)
}

try {
	docker(...compose, 'up', '-d', '--wait')
	await runTests()
} finally {
	spawnSync('docker', [...compose, 'down', '--volumes', '--remove-orphans'], { stdio: 'inherit' })
}
