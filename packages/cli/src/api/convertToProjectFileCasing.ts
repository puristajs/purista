import { camelCase, kebabCase, pascalCase, pascalSnakeCase, snakeCase } from './change-case.js'
import type { PuristaConfig } from './loadPuristaConfig.js'

export const convertToProjectFileCasing = (input: string, puristaProjectConfig: PuristaConfig) => {
	switch (puristaProjectConfig.fileConvention) {
		case 'kebab':
			return kebabCase(input)
		case 'pascal':
			return pascalCase(input)
		case 'snake':
			return snakeCase(input)
		case 'pascalSnake':
			return pascalSnakeCase(input)
		default:
			return camelCase(input)
	}
}
