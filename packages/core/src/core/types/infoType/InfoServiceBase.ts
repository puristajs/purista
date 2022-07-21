import type { EBMessageBase } from '../EBMessageBase'

export type InfoServiceBase = {
  sender: {
    serviceName: string
    serviceVersion: string
    serviceTarget: string
  }
  payload?: Record<string, unknown>
} & EBMessageBase
