import { HandledError } from '../../Error/HandledError.impl'
import { UnhandledError } from '../../Error/UnhandledError.impl'

export type PendigInvocation = {
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError | HandledError): void
}
