import { camelCase, kebabCase, pascalCase, pascalSnakeCase, snakeCase } from '../api/change-case.js'
import type { CreateProjectInput } from './types.js'

export const convertString = (settings: Pick<CreateProjectInput, 'fileConvention'>, input: string) => {
	switch (settings.fileConvention) {
		case 'camel':
			return camelCase(input)
		case 'snake':
			return snakeCase(input)
		case 'kebab':
			return kebabCase(input)
		case 'pascal':
			return pascalCase(input)
		case 'pascalSnake':
			return pascalSnakeCase(input)
	}
}

export const convertFilename = (settings: Pick<CreateProjectInput, 'fileConvention'>, input: string) =>
	input
		.split('.')
		.map(entry => convertString(settings, entry))
		.join('.')

export const rewriteLocalImportPaths = (settings: Pick<CreateProjectInput, 'fileConvention'>, content: string) => {
	const importRegex = /import\s+(?:[^'"]*?\s+from\s+)?['"](\.\/[^'"]+)['"]/g

	return content.replace(importRegex, (match, pathFragment: string) => {
		const rewritten = pathFragment
			.split('/')
			.map(entry => convertFilename(settings, entry))
			.join('/')
		return match.replace(pathFragment, rewritten)
	})
}
