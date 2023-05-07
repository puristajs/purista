import { context, propagation } from '@opentelemetry/api'

import { Logger } from '../types'

/**
 *
 * @returns
 *
 * @group Helper
 */
export const serializeOtp = () => {
  const serializedContext = {}

  propagation.inject(context.active(), serializedContext)
  return JSON.stringify(serializedContext)
}

/**
 *
 * @param logger
 * @param otp
 * @returns
 *
 * @group Helper
 */
export const deserializeOtp = (logger: Logger, otp?: string) => {
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
