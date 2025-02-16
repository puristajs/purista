import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { PackageJson } from 'type-fest'

/**
 * Loads the `package.json` file from the given project root path.
 */
export const loadPackageJson = async (projectRootPath: string): Promise<PackageJson> => {
	try {
		const content = await readFile(join(projectRootPath, 'package.json'), 'utf-8')
		return JSON.parse(content)
	} catch (error) {
		throw new Error('Unable to proceed without package.json')
	}
}
