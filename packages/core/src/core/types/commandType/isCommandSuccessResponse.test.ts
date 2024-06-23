import { getCommandErrorMessageMock, getCommandSuccessMessageMock } from '../../../mocks/index.js'
import { isCommandSuccessResponse } from './isCommandSuccessResponse.impl.js'

describe('isCommandSuccessResponse', () => {
	it('returns true if it is a command success message', () => {
		const message = getCommandSuccessMessageMock({})
		expect(isCommandSuccessResponse(message)).toBeTruthy()
	})

	it('returns false if it is not a command success message', () => {
		const message = getCommandErrorMessageMock()
		expect(isCommandSuccessResponse(message)).toBeFalsy()
	})
})
