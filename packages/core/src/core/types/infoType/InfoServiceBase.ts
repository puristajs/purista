import type { EBMessageBase } from '../EBMessageBase'
import { Prettify } from '../Prettify'

export type InfoServiceBase = Prettify<
  {
    contentType: 'application/json'
    contentEncoding: 'utf-8'
    payload?: unknown
  } & EBMessageBase
>
