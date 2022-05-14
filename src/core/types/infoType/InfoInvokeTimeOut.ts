import { CorrelationId } from '../CorrelationId'
import { EBMessageType } from '../EBMessageType.enum'
import { TraceId } from '../TraceId'
import { InfoServiceBase } from './InfoServiceBase'

export type InfoInvokeTimeOutPayload = {
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

export type InfoInvokeTimeOut = {
  messageType: EBMessageType.InfoInvokeTimeOut
  data: InfoInvokeTimeOutPayload
} & InfoServiceBase
