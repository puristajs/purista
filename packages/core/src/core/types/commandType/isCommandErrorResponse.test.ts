import { getCommandErrorMessageMock, getCommandMessageMock } from '../../../mocks/index.js'
import { isCommandErrorResponse } from './isCommandErrorResponse.impl.js'

describe('isCommandErrorResponse', () => {
	it('returns true if it is a command error message', () => {
		const message = getCommandErrorMessageMock()
		expect(isCommandErrorResponse(message)).toBeTruthy()
	})

	it('returns false if it is not a command error message', () => {
		const message = getCommandMessageMock()
		expect(isCommandErrorResponse(message)).toBeFalsy()
	})

	it('returns false if it is not a message', () => {
		expect(isCommandErrorResponse('string')).toBeFalsy()
	})

	it('returns false if it gets null', () => {
		expect(isCommandErrorResponse(null)).toBeFalsy()
	})
})
