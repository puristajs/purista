import { context, propagation } from '@opentelemetry/api'

import { Logger } from '../types'

export const serializeOtp = () => {
  const serializedContext = {}

  propagation.inject(context.active(), serializedContext)
  return JSON.stringify(serializedContext)
}

export const deserializeOtp = async (logger: Logger, otp?: string) => {
  try {
    let header = {}

    if (otp) {
      header = JSON.parse(otp)
    }

    return propagation.extract(context.active(), header)
  } catch (err) {
    logger.error({ err }, 'unable to deserialize otp entry in message')
  }
}
