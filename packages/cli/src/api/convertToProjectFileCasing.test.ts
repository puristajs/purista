import { describe, it, expect } from 'vitest'
import { convertToProjectFileCasing } from './convertToProjectFileCasing.js'

const config = { fileConvention: 'camel' } as any

describe('convertToProjectFileCasing', () => {
  it('converts to camelCase by default', () => {
    expect(convertToProjectFileCasing('hello world', config)).toBe('helloWorld')
  })

  it('supports kebab case', () => {
    const conf = { fileConvention: 'kebab' } as any
    expect(convertToProjectFileCasing('hello world', conf)).toBe('hello-world')
  })

  it('supports pascal case', () => {
    const conf = { fileConvention: 'pascal' } as any
    expect(convertToProjectFileCasing('hello world', conf)).toBe('HelloWorld')
  })

  it('supports snake case', () => {
    const conf = { fileConvention: 'snake' } as any
    expect(convertToProjectFileCasing('hello world', conf)).toBe('hello_world')
  })

  it('supports pascal snake case', () => {
    const conf = { fileConvention: 'pascalSnake' } as any
    expect(convertToProjectFileCasing('hello world', conf)).toBe('Hello_World')
  })
})
