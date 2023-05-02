import type { EBMessageBase } from '../EBMessageBase'
import { Prettify } from '../Prettify'

export type InfoServiceBase = Prettify<
  {
    contentType: 'application/json'
    contentEncoding: 'utf-8'
    sender: {
      serviceName: string
      serviceVersion: string
      serviceTarget: string
    }
    payload?: unknown
  } & EBMessageBase
>
