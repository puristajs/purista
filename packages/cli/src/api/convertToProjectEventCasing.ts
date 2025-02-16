import {
	camelCase,
	constantCase,
	dotCase,
	kebabCase,
	pascalCase,
	pascalSnakeCase,
	pathCase,
	snakeCase,
	trainCase,
} from 'change-case'
import type { PuristaConfig } from './loadPuristaConfig.js'

export const convertToProjectEventCasing = (input: string, puristaProjectConfig: PuristaConfig) => {
	switch (puristaProjectConfig.eventConvention) {
		case 'camel':
			return camelCase(input)
		case 'kebab':
			return kebabCase(input)
		case 'pascal':
			return pascalCase(input)
		case 'snake':
			return snakeCase(input)
		case 'pascalSnake':
			return pascalSnakeCase(input)
		case 'constantCase':
			return constantCase(input)
		case 'dotCase':
			return dotCase(input)
		case 'pathCase':
			return pathCase(input)
		case 'trainCase':
			return trainCase(input)
	}
}
