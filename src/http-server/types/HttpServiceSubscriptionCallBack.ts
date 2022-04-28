import { EBMessage, SubscriptionCallback } from '../../core'
import { HttpServerService } from '../HttpServerService.impl'

export type HttpServiceSubscriptionCallBack<MessageType = EBMessage> = SubscriptionCallback<
  HttpServerService,
  MessageType
>
