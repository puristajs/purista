import { exec } from 'node:child_process'

export const installDependencies = async (cmd: string) => {
	const child = exec(cmd, err => {
		if (err) {
			console.error(err)
			throw err
		}
	})
	child.stderr?.pipe(process.stderr)
	child.stdout?.pipe(process.stdout)
	return new Promise(resolve => child.on('close', resolve))
}
