import { EBMessageType } from '../types'
import { createInfoMessage } from './createInfoMessage.impl'

describe('createInfoMessage', () => {
  it('creates a info message', () => {
    const payload = { content: 'result content' }

    const sender = {
      serviceName: 'SenderService',
      serviceVersion: '1.1.1',
      serviceTarget: 'senderServiceTarget',
    }

    const result = createInfoMessage(EBMessageType.InfoServiceInit, sender, { payload })

    expect(result.messageType).toBe(EBMessageType.InfoServiceInit)
    expect(result.sender).toStrictEqual(sender)
    expect(result.traceId).toBeDefined()
    expect(result.id).toBeDefined()
    expect(result.timestamp).toBeDefined()
  })
})
