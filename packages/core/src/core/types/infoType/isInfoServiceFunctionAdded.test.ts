import { createInfoMessage } from '../../helper/index.js'
import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import { isInfoServiceFunctionAdded } from './isInfoServiceFunctionAdded.impl.js'

describe('isInfoServiceFunctionAdded', () => {
  it('returns true if it is a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
      instanceId: 'a',
    })
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeTruthy()
  })

  it('returns false if it is not a info service added message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceInit, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
      instanceId: 'a',
    })
    expect(isInfoServiceFunctionAdded(message as EBMessage)).toBeFalsy()
  })
})
