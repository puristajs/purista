import { getCustomMessageMessageMock } from '../../../mocks'
import { createInfoMessage } from '../../helper'
import type { EBMessage } from '../../types'
import { EBMessageType } from '../../types'
import { isInfoMessage } from './isInfoMessage.impl'

describe('isInfoMessage', () => {
  it('returns true if it is a info message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
    })
    expect(isInfoMessage(message as EBMessage)).toBeTruthy()
  })

  it('returns false if it is not a info message', () => {
    const message = getCustomMessageMessageMock('123', {})
    expect(isInfoMessage(message as EBMessage)).toBeFalsy()
  })
})
