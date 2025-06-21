import { describe, it, expect } from 'vitest'
import { convertToProjectEventCasing } from './convertToProjectEventCasing.js'

const base = { eventConvention: 'camel' } as any

describe('convertToProjectEventCasing', () => {
  it('camel case', () => {
    expect(convertToProjectEventCasing('some event', base)).toBe('someEvent')
  })

  it('kebab case', () => {
    const conf = { eventConvention: 'kebab' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('some-event')
  })

  it('pascal case', () => {
    const conf = { eventConvention: 'pascal' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('SomeEvent')
  })

  it('snake case', () => {
    const conf = { eventConvention: 'snake' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('some_event')
  })

  it('pascal snake', () => {
    const conf = { eventConvention: 'pascalSnake' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('Some_Event')
  })

  it('constant', () => {
    const conf = { eventConvention: 'constantCase' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('SOME_EVENT')
  })

  it('dot case', () => {
    const conf = { eventConvention: 'dotCase' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('some.event')
  })

  it('path case', () => {
    const conf = { eventConvention: 'pathCase' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('some/event')
  })

  it('train case', () => {
    const conf = { eventConvention: 'trainCase' } as any
    expect(convertToProjectEventCasing('some event', conf)).toBe('Some-Event')
  })
})
