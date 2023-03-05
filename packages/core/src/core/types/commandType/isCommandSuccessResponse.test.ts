import { getCommandErrorMessageMock, getCommandSuccessMessageMock } from '../../../testhelper'
import { isCommandSuccessResponse } from './isCommandSuccessResponse.impl'

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
