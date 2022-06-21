import { CorrelationId } from '../CorrelationId'
import { EBMessageType } from '../EBMessageType.enum'
import { TraceId } from '../TraceId'
import { InfoServiceBase } from './InfoServiceBase'

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
