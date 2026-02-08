import { describe, expect, it } from 'vitest'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'
import { type PuristaConfig, puristaConfigSchema } from './loadPuristaConfig.js'

const getConfig = (fileConvention: PuristaConfig['fileConvention']) => puristaConfigSchema.parse({ fileConvention })

describe('convertToProjectFileCasing', () => {
	it('converts to camelCase by default', () => {
		expect(convertToProjectFileCasing('hello world', getConfig('camel'))).toBe('helloWorld')
	})

	it('supports kebab case', () => {
		expect(convertToProjectFileCasing('hello world', getConfig('kebab'))).toBe('hello-world')
	})

	it('supports pascal case', () => {
		expect(convertToProjectFileCasing('hello world', getConfig('pascal'))).toBe('HelloWorld')
	})

	it('supports snake case', () => {
		expect(convertToProjectFileCasing('hello world', getConfig('snake'))).toBe('hello_world')
	})

	it('supports pascal snake case', () => {
		expect(convertToProjectFileCasing('hello world', getConfig('pascalSnake'))).toBe('Hello_World')
	})
})
