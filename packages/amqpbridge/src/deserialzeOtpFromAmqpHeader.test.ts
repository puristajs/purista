import { getCommandMessageMock, getLoggerMock } from '@purista/core'
import { ConsumeMessage } from 'amqplib'
import { createSandbox, SinonSandbox } from 'sinon'

import { deserializeOtpFromAmqpHeader } from './deserializeOtpFromAmqpHeader.impl'
import { jsonEncoder, plainEncrypter } from './payloadHandling'

describe('deserializeOtpFromAmqpHeader', () => {
  let sandbox: SinonSandbox

  beforeEach(() => {
    sandbox = createSandbox()

    jest.mock('./decodeContent.impl', () => ({
      decodeContent: sandbox.stub().resolves({}),
    }))
  })

  afterEach(() => {
    sandbox.restore()
    sandbox.reset()
  })

  it('extracts from AMQP header', async () => {
    const logger = getLoggerMock(sandbox)
    const encrypter = { ...plainEncrypter }
    const decoder = { ...jsonEncoder }

    const traceparent = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'

    const content = Buffer.from(
      JSON.stringify({
        ...getCommandMessageMock({ otp: JSON.stringify({ traceparent }) }),
      }),
    )

    const message = {
      content,
      properties: {
        headers: {
          contentType: 'application/json',
          contentEncoding: 'utf-8',
          traceparent,
        },
      },
    } as unknown as ConsumeMessage

    const result = await deserializeOtpFromAmqpHeader(logger.mock, message, encrypter, decoder)

    expect(result).toBeDefined()
  })

  it('extracts from message header', async () => {
    const logger = getLoggerMock(sandbox)

    const encrypter = { ...plainEncrypter }
    const decoder = { ...jsonEncoder }

    const traceparent = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'

    const message = getCommandMessageMock({ otp: JSON.stringify({ traceparent }) })

    const content = Buffer.from(
      JSON.stringify({
        ...message,
      }),
    )

    const msg = {
      content,
      properties: {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
        headers: {},
      },
    } as unknown as ConsumeMessage

    const result = await deserializeOtpFromAmqpHeader(logger.mock, msg, encrypter, decoder)

    expect(result).toBeDefined()
  })
})
