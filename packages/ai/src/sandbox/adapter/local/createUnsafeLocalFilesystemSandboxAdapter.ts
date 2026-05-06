import { exec } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { promisify } from 'node:util'

export type FilesystemSandboxAdapter = {
	executeCommand: (command: string) => Promise<{ stdout: string; stderr: string; exitCode: number }>
	readFile: (path: string) => Promise<string>
	writeFiles: (files: Array<{ path: string; content: string | Buffer }>) => Promise<void>
}

/**
 * Creates an unsafe local-development adapter constrained to one project root for
 * file I/O, but still executing shell commands directly on the host machine.
 *
 * This helper does not provide real sandbox isolation and must not be treated as
 * equivalent to a container or VM-backed sandbox provider.
 */
export const createUnsafeLocalFilesystemSandboxAdapter = (projectRoot: string): FilesystemSandboxAdapter => {
	const execAsync = promisify(exec)
	const rootResolved = resolve(projectRoot)
	const rootPrefix = rootResolved.endsWith('/') ? rootResolved : `${rootResolved}/`

	const safeResolve = (path: string) => {
		const full = resolve(projectRoot, path)
		if (full !== rootResolved && !full.startsWith(rootPrefix)) {
			throw new Error('Path escapes project root')
		}
		return full
	}

	return {
		async executeCommand(command: string) {
			try {
				const { stdout, stderr } = await execAsync(command, {
					cwd: projectRoot,
					shell: '/bin/bash',
					maxBuffer: 10 * 1024 * 1024,
				})
				return { stdout, stderr, exitCode: 0 }
			} catch (error) {
				const typed = error as { stdout?: string; stderr?: string; code?: number }
				return {
					stdout: typed.stdout ?? '',
					stderr: typed.stderr ?? '',
					exitCode: typeof typed.code === 'number' ? typed.code : 1,
				}
			}
		},
		async readFile(path: string) {
			return await readFile(safeResolve(path), 'utf8')
		},
		async writeFiles(files: Array<{ path: string; content: string | Buffer }>) {
			for (const file of files) {
				const target = safeResolve(file.path)
				await mkdir(dirname(target), { recursive: true })
				await writeFile(target, file.content)
			}
		},
	}
}
