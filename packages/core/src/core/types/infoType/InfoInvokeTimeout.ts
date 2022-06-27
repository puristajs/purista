import type { CorrelationId } from '../CorrelationId'
import type { EBMessageType } from '../EBMessageType.enum'
import type { TraceId } from '../TraceId'
import type { InfoServiceBase } from './InfoServiceBase'

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
