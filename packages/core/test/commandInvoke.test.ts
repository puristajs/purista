import { createSandbox } from 'sinon'

import { theServiceV1Service } from '../../../test/service/theService/v1'
import { DefaultEventBridge, EBMessageType } from '../src'

describe('command invoke test', () => {
  const sandbox = createSandbox()
  const eventBridge = new DefaultEventBridge({})

  let service: any

  beforeAll(async () => {
    await eventBridge.start()
  })

  afterAll(async () => {
    await eventBridge.destroy()
  })

  beforeAll(async () => {
    service = theServiceV1Service.getInstance(eventBridge)
    await service.start()
  })

  afterAll(() => {
    service.destroy()
    sandbox.restore()
  })

  it('does not fail if schema is matching', async () => {
    const payload = 'the payload'
    const parameter = 'the parameter'

    const result = await service.executeCommand({
      receiver: {
        serviceTarget: 'invokeFoo',
      },
      correlationId: '1',
      payload: {
        payload,
        parameter,
      },
    })

    expect(result.payload).toStrictEqual({
      payload,
      parameter,
    })
  })

  it('does fail if schema is not matching', async () => {
    const payload = 'the payload'
    const parameter = 'the parameter'

    const result = await service.executeCommand({
      receiver: {
        serviceTarget: 'invokeFooFailed',
      },
      correlationId: '1',
      payload: {
        payload,
        parameter,
      },
    })

    expect(result.isHandledError).toBeFalsy()
    expect(result.messageType).toStrictEqual(EBMessageType.CommandErrorResponse)
    expect(result.payload.status).toBe(500)
  })
})
