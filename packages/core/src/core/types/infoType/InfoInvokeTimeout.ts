import type { CorrelationId } from '../CorrelationId.js'
import type { EBMessageType } from '../EBMessageType.enum.js'
import type { TraceId } from '../TraceId.js'
import type { InfoServiceBase } from './InfoServiceBase.js'

export type InfoInvokeTimeoutPayload = {
	traceId: TraceId
	correlationId: CorrelationId
	sender: {
		serviceName: string
		serviceVersion: string
		serviceTarget: string
	}
	receiver: {
		serviceName: string
		serviceVersion: string
		serviceTarget: string
	}
	timestamp: number
}

export type InfoInvokeTimeout = {
	messageType: EBMessageType.InfoInvokeTimeout
} & InfoServiceBase
