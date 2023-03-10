import { SpanProcessor } from '@opentelemetry/sdk-trace-node'

import { Logger } from '../types'
import { DefaultSecretStore } from './DefaultSecretStore.impl'

export const initDefaultSecretStore = (options: {
  logger: Logger
  spanProcessor: SpanProcessor | undefined
}): DefaultSecretStore => {
  const store = new DefaultSecretStore({}, options)
  return store
}
