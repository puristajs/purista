import { createInfoMessage } from '../../helper'
import { EBMessage, EBMessageType } from '../../types'
import { isInfoServiceFunctionAdded } from './isInfoServiceFunctionAdded.impl'

describe('isInfoServiceFunctionAdded', () => {
  it('returns true if it is a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, 'serviceName', '1')
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeTruthy()
  })

  it('returns false if it is not a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceInit, 'serviceName', '1')
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeFalsy()
  })
})
