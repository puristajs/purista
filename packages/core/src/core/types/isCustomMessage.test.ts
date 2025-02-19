import { getCommandSuccessMessageMock, getCustomMessageMessageMock } from '../../mocks/index.js'
import { isCustomMessage } from './isCustomMessage.impl.js'

describe('isCustomMessage', () => {
	it('returns true if it is a custom message', () => {
		const message = getCustomMessageMessageMock('test', {})
		expect(isCustomMessage(message)).toBeTruthy()
	})

	it('returns false if it is not a custom message', () => {
		const message = getCommandSuccessMessageMock({})
		expect(isCustomMessage(message)).toBeFalsy()
	})
})
