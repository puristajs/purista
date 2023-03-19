import { StatusCode } from '../types'
import { getErrorMessageForCode } from './getErrorMessageForCode.impl'

it('returns a message string for error code', () => {
  expect(getErrorMessageForCode(200)).toBe('OK')

  expect(getErrorMessageForCode(400)).toBe('Bad Request')

  expect(getErrorMessageForCode(900 as StatusCode)).toBe('Unknown Error')
})
