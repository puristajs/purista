import type { HandledError } from '../../core/Error/HandledError.impl.js'
import type { UnhandledError } from '../../core/Error/UnhandledError.impl.js'

export type PendigInvocation = {
	resolve(responsePayload: unknown): void
	reject(error: UnhandledError | HandledError): void
}
