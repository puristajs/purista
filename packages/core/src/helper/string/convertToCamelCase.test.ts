import { convertToCamelCase } from './convertToCamelCase.impl.js'

describe('convertToCamelCase', () => {
  it('converts from snakeCase', () => {
    const result = convertToCamelCase('snake-case-text')
    expect('snakeCaseText').toBe(result)
  })

  it('converts from pascal case', () => {
    const result = convertToCamelCase('PascalCaseText')
    expect('pascalCaseText').toBe(result)
  })

  it('converts from kebab case', () => {
    const result = convertToCamelCase('kebab-case-text')
    expect('kebabCaseText').toBe(result)
  })

  it('converts from mixed text', () => {
    const result = convertToCamelCase('some-mixed_string _With spaces_underscores-and-hyphens')
    expect('someMixedStringWithSpacesUnderscoresAndHyphens').toBe(result)
  })
})
