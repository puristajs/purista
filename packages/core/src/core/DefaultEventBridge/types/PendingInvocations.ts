import { HandledError } from '../../HandledError.impl'
import { UnhandledError } from '../../UnhandledError.impl'

export type PendigInvocation = {
  resolve(responsePayload: unknown): void
  reject(error: UnhandledError | HandledError): void
}
