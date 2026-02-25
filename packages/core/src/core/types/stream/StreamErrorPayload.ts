import type { StatusCode } from '../StatusCode.enum.js'
import type { TraceId } from '../TraceId.js'

export type StreamErrorPayload = {
	status: StatusCode
	message: string
	isHandledError: boolean
	data?: unknown
	traceId?: TraceId
}
