import { getCommandErrorMessageMock, getCommandMessageMock, getCommandSuccessMessageMock } from '../../../mocks'
import { isCommandResponse } from './isCommandResponse.impl'

describe('isCommandResponse', () => {
  it('returns true if it is a command error response message', () => {
    const message = getCommandErrorMessageMock()
    expect(isCommandResponse(message)).toBeTruthy()
  })

  it('returns true if it is a command success response message', () => {
    const message = getCommandSuccessMessageMock({})
    expect(isCommandResponse(message)).toBeTruthy()
  })

  it('returns false if it is not a command response message', () => {
    const message = getCommandMessageMock()
    expect(isCommandResponse(message)).toBeFalsy()
  })
})
