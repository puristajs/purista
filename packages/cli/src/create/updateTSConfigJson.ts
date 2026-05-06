import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { TsConfigJson } from 'type-fest'
import type { CreateProjectInput } from './types.js'

export const updateTSConfigJson = async (targetDirectoryPath: string, settings: CreateProjectInput) => {
	const tsConfigFilePath = join(targetDirectoryPath, 'tsconfig.json')
	const content = await readFile(tsConfigFilePath, 'utf-8')

	const tsConfig = JSON.parse(content) as TsConfigJson
	const compilerTypes = settings.runtime === 'bun' ? ['bun'] : ['node']
	await writeFile(
		tsConfigFilePath,
		JSON.stringify(
			{
				...tsConfig,
				compilerOptions: {
					...tsConfig.compilerOptions,
					types: compilerTypes,
				},
			},
			null,
			2,
		),
		'utf-8',
	)
}
