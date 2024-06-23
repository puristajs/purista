import { convertToPascalCase } from './convertToPascalCase.impl.js'

describe('convertToPascalCase', () => {
	it('converts from snakeCase', () => {
		const result = convertToPascalCase('snake-case-text')
		expect('SnakeCaseText').toBe(result)
	})

	it('converts from camel case', () => {
		const result = convertToPascalCase('camelCaseText')
		expect('CamelCaseText').toBe(result)
	})

	it('converts from kebab case', () => {
		const result = convertToPascalCase('kebab-case-text')
		expect('KebabCaseText').toBe(result)
	})

	it('converts from mixed text', () => {
		const result = convertToPascalCase('some-mixed_string _With spaces_underscores-and-hyphens')
		expect('SomeMixedStringWithSpacesUnderscoresAndHyphens').toBe(result)
	})
})
