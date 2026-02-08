import { describe, expect, it } from 'vitest'
import { convertToProjectEventCasing } from './convertToProjectEventCasing.js'
import { type PuristaConfig, puristaConfigSchema } from './loadPuristaConfig.js'

const getConfig = (eventConvention: PuristaConfig['eventConvention']) => puristaConfigSchema.parse({ eventConvention })

describe('convertToProjectEventCasing', () => {
	it('camel case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('camel'))).toBe('someEvent')
	})

	it('kebab case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('kebab'))).toBe('some-event')
	})

	it('pascal case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('pascal'))).toBe('SomeEvent')
	})

	it('snake case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('snake'))).toBe('some_event')
	})

	it('pascal snake', () => {
		expect(convertToProjectEventCasing('some event', getConfig('pascalSnake'))).toBe('Some_Event')
	})

	it('constant', () => {
		expect(convertToProjectEventCasing('some event', getConfig('constantCase'))).toBe('SOME_EVENT')
	})

	it('dot case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('dotCase'))).toBe('some.event')
	})

	it('path case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('pathCase'))).toBe('some/event')
	})

	it('train case', () => {
		expect(convertToProjectEventCasing('some event', getConfig('trainCase'))).toBe('Some-Event')
	})
})
