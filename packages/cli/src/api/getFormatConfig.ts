import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Options } from 'code-block-writer'

/**
 * Try to figure out the formatting config for a given project.
 */
export const getFormatConfig = async (projectPath: string) => {
	const codeWriterOptions: Partial<Options> = {
		indentNumberOfSpaces: 2,
		useTabs: true,
		useSingleQuote: true,
		newLine: '\n',
	}

	let formatter: 'biome' | 'prettier' | 'none' = 'none'

	const biome = join(projectPath, 'biome.json')
	try {
		const biomeFileContent = await readFile(biome, 'utf-8')
		const biomeConfig = JSON.parse(biomeFileContent)

		const format = {
			...biomeConfig.formatter,
			...biomeConfig.javascript?.formatter,
		}

		codeWriterOptions.indentNumberOfSpaces = format.indentWidth || codeWriterOptions.indentNumberOfSpaces
		if (format.indentStyle) {
			codeWriterOptions.useTabs = biomeConfig.formatter.indentStyle === 'tab'
		}

		codeWriterOptions.useSingleQuote = format.quoteStyle === 'double' ? false : codeWriterOptions.useSingleQuote

		formatter = 'biome'
		return { codeWriterOptions, formatter }
	} catch (error) {
		// do nothing
	}

	return { codeWriterOptions, formatter }
}
