import { spawn } from 'node:child_process'

function run(command, args) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, { stdio: 'inherit' })
		child.once('error', reject)
		child.once('exit', (code, signal) => {
			if (code === 0) resolve()
			else reject(new Error(`${command} ${args.join(' ')} failed (${code ?? signal})`))
		})
	})
}

const compose = ['compose', '-p', 'example-bank-provider']
await run('docker', [...compose, 'up', '-d', '--wait'])
try {
	await run('npx', ['vitest', 'run', 'src/legacyTransactionProvider.integration.test.ts'])
} finally {
	await run('docker', [...compose, 'down', '--volumes'])
}
