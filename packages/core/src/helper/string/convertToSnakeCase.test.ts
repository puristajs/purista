import { convertToSnakeCase } from './convertToSnakeCase.impl'

describe('convertToSnakeCase', () => {
  it('converts from camelCase', () => {
    const result = convertToSnakeCase('camelCaseText')
    expect('camel_case_text').toBe(result)
  })

  it('converts from pascal case', () => {
    const result = convertToSnakeCase('PascalCaseText')
    expect('pascal_case_text').toBe(result)
  })

  it('converts from kebab case', () => {
    const result = convertToSnakeCase('kebab-case-text')
    expect('kebab_case_text').toBe(result)
  })

  it('converts from mixed text', () => {
    const result = convertToSnakeCase('some-mixed_string _With spaces_underscores-and-hyphens')
    expect('some_mixed_string_with_spaces_underscores_and_hyphens').toBe(result)
  })
})
