import { createInfoMessage } from '../../helper'
import type { EBMessage } from '../../types'
import { EBMessageType } from '../../types'
import { isInfoServiceFunctionAdded } from './isInfoServiceFunctionAdded.impl'

describe('isInfoServiceFunctionAdded', () => {
  it('returns true if it is a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
    })
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeTruthy()
  })

  it('returns false if it is not a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceInit, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
    })
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeFalsy()
  })
})
