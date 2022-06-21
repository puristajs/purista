import { EBMessageBase } from '../EBMessageBase'

export type InfoServiceBase = {
  sender: {
    serviceName: string
    serviceVersion: string
    serviceTarget: string
  }
  data?: Record<string, unknown>
} & EBMessageBase
