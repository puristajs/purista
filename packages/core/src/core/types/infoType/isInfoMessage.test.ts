import { getCustomMessageMessageMock } from '../../../mocks/index.js'
import { createInfoMessage } from '../../helper/index.js'
import type { EBMessage } from '../EBMessage.js'
import { EBMessageType } from '../EBMessageType.enum.js'
import { isInfoMessage } from './isInfoMessage.impl.js'

describe('isInfoMessage', () => {
  it('returns true if it is a info message', () => {
    const message = createInfoMessage(EBMessageType.InfoServiceFunctionAdded, {
      serviceName: 'serviceName',
      serviceVersion: '1',
      serviceTarget: '',
      instanceId: 'a',
    })
    expect(isInfoMessage(message as EBMessage)).toBeTruthy()
  })

  it('returns false if it is not a info message', () => {
    const message = getCustomMessageMessageMock('123', {})
    expect(isInfoMessage(message as EBMessage)).toBeFalsy()
  })
})
