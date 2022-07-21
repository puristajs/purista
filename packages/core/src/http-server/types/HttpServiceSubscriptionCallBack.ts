import { EBMessage, SubscriptionFunction } from '../../core'
import { HttpServerService } from '../HttpServerService.impl'

export type HttpServiceSubscriptionCallBack<MessageType = EBMessage, Payload = unknown> = SubscriptionFunction<
  HttpServerService,
  MessageType,
  Payload
>
