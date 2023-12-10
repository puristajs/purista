import type { HandledError, UnhandledError } from '../../core/index.js'

export type PendigInvocation = {
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError | HandledError): void
}
