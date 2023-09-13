import type { HandledError, UnhandledError } from '../../core'

export type PendigInvocation = {
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError | HandledError): void
}
