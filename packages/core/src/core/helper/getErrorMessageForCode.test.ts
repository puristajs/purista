import type { StatusCode } from '../types/index.js'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl.js'

it('returns a message string for error code', () => {
  expect(getErrorMessageForCode(200)).toBe('OK')

  expect(getErrorMessageForCode(400)).toBe('Bad Request')

  expect(getErrorMessageForCode(900 as StatusCode)).toBe('Unknown Error')
})
