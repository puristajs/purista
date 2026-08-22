import { camelCase, kebabCase, pascalCase, pascalSnakeCase, snakeCase } from './change-case.js'
import type { PuristaConfig } from './loadPuristaConfig.js'

/**
 * Convert a logical artifact name to the file casing configured in `purista.json`.
 *
 * @example
 * ```ts
 * convertToProjectFileCasing('user v1 service builder', { ...config, fileConvention: 'kebab' })
 * // "user-v1-service-builder"
 * ```
 */
export const convertToProjectFileCasing = (
	input: string,
	puristaProjectConfig: Pick<PuristaConfig, 'fileConvention'>,
) => {
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
