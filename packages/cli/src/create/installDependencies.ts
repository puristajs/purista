import { exec } from 'node:child_process'
import { resolve } from 'node:path'
import type { PackageManager } from './types.js'

const knownPackageManagers: Record<PackageManager, string> = {
	npm: 'npm install',
	bun: 'bun install',
	pnpm: 'pnpm install',
	yarn: 'yarn',
}

export const installDependencies = async (packageManager: PackageManager, target: string) => {
	const command = knownPackageManagers[packageManager]
	const processHandle = exec(command, { cwd: resolve(target) })
	processHandle.stdout?.pipe(process.stdout)
	processHandle.stderr?.pipe(process.stderr)

	const exitCode = await new Promise<number>(resolve => {
		processHandle.on('exit', code => resolve(code ?? 0xff))
	})

	processHandle.on('error', console.error)

	if (exitCode !== 0) {
		throw new Error(`Failed to install project dependencies with ${packageManager}.`)
	}
}
