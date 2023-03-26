import { getCommandMessageMock, getCommandSuccessMessageMock } from '../../../mocks'
import { isCommand } from './isCommand.impl'

describe('isCommand', () => {
  it('returns true if it is a command message', () => {
    const message = getCommandMessageMock()
    expect(isCommand(message)).toBeTruthy()
  })

  it('returns false if it is not a command message', () => {
    const message = getCommandSuccessMessageMock({})
    expect(isCommand(message)).toBeFalsy()
  })
})
