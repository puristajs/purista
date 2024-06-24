import { context, propagation } from '@opentelemetry/api'
import type { EBMessage, Logger } from '@purista/core'
import { deserializeOtp } from '@purista/core'
import type { ConsumeMessage } from 'amqplib'

import { decodeContent } from './decodeContent.impl.js'
import type { Encoder, Encrypter } from './types/index.js'

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

		if (header?.traceparent) {
			return propagation.extract(context.active(), header)
		}

		// if not present try to find in message content
		const msg = await decodeContent<EBMessage>(
			message.content,
			message.properties.contentType,
			message.properties.contentEncoding,
			encrypter,
			encoder,
		)

		return deserializeOtp(logger, msg.otp)
	} catch (err) {
		logger.error({ err }, 'unable to deserialize otp entry from amqp header')
	}
}
