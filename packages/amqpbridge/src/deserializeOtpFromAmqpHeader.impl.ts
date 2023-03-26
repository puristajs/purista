import { context, propagation } from '@opentelemetry/api'
import { deserializeOtp, EBMessage, Logger } from '@purista/core'
import { ConsumeMessage } from 'amqplib'

import { decodeContent } from './decodeContent.impl'
import { Encoder, Encrypter } from './types'

export const deserializeOtpFromAmqpHeader = async (
  logger: Logger,
  message: ConsumeMessage | null,
  encrypter: Encrypter,
  encoder: Encoder,
) => {
  if (!message) {
    return
  }
  try {
    // try to use amqp header first
    const header = message.properties.headers

    // if not present try to ffind in message content
    if (header['traceparent']) {
      return propagation.extract(context.active(), header)
    }

    const msg = await decodeContent<EBMessage>(
      message.content,
      message.properties.contentType,
      message.properties.contentEncoding,
      encrypter,
      encoder,
    )
    return await deserializeOtp(logger, msg.otp)
  } catch (err) {
    logger.error({ err }, 'unable to deserialize otp entry from amqp header')
  }
}
