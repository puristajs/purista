import fs from 'node:fs'

export const mkdirp = (dir: string) => {
	try {
		fs.mkdirSync(dir, { recursive: true })
	} catch (error) {
		if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
			return
		}
		throw error
	}
}

export const ensureProjectDir = async (targetDirectoryPath: string) => {
	if (fs.existsSync(targetDirectoryPath)) {
		return fs.readdirSync(targetDirectoryPath).length === 0
	}

	mkdirp(targetDirectoryPath)
	return true
}
