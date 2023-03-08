import type { EBMessageBase } from '../EBMessageBase'

export type InfoServiceBase = {
  contentType: 'application/json'
  contentEncoding: 'utf-8'
  sender: {
    serviceName: string
    serviceVersion: string
    serviceTarget: string
  }
  payload?: unknown
} & EBMessageBase
