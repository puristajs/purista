import { convertToKebabCase } from './convertToKebabCase.impl.js'

describe('convertToKebabCase', () => {
	it('converts from snakeCase', () => {
		const result = convertToKebabCase('snake-case-text')
		expect('snake-case-text').toBe(result)
	})

	it('converts from pascal case', () => {
		const result = convertToKebabCase('PascalCaseText')
		expect('pascal-case-text').toBe(result)
	})

	it('converts from camelcase', () => {
		const result = convertToKebabCase('camelCaseText')
		expect('camel-case-text').toBe(result)
	})

	it('converts from mixed text', () => {
		const result = convertToKebabCase('some-mixed_string _With spaces_underscores-and-hyphens')
		expect('some-mixed-string-with-spaces-underscores-and-hyphens').toBe(result)
	})
})
