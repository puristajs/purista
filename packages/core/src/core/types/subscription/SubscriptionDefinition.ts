import type { z } from 'zod'

import { EBMessageType } from '../EBMessageType.enum'
import { InstanceId } from '../InstanceId'
import { PrincipalId } from '../PrincipalId'
import type { ServiceClass } from '../ServiceClass'
import type { SubscriptionAfterGuardHook } from './SubscriptionAfterGuardHook'
import type { SubscriptionBeforeGuardHook } from './SubscriptionBeforeGuardHook'
import type { SubscriptionFunction } from './SubscriptionFunction'
import { SubscriptionSettings } from './SubscriptionSettings'
import { SubscriptionTransformInputHook } from './SubscriptionTransformInputHook'
import { SubscriptionTransformOutputHook } from './SubscriptionTransformOutputHook'

/**
 * The definition for a subscription provided by some service.
 */
export type SubscriptionDefinition<
  ServiceClassType extends ServiceClass = ServiceClass,
  MetadataType = Record<string, unknown>,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  MessageResultType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = MessageResultType,
> = {
  subscriptionName: string
  subscriptionDescription: string
  metadata: MetadataType
  call: SubscriptionFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType
  >
  sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  messageType?: EBMessageType
  eventName?: string // event to listen for
  emitEventName?: string // event to emit if output payload ist set
  instanceId?: InstanceId
  principalId?: PrincipalId
  settings: SubscriptionSettings
  hooks: {
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: SubscriptionTransformInputHook<ServiceClassType, MessagePayloadType, MessageParamsType>
    }
    beforeGuard?: SubscriptionBeforeGuardHook<ServiceClassType, FunctionPayloadType, FunctionParamsType>[]
    afterGuard?: SubscriptionAfterGuardHook<ServiceClassType, FunctionResultType, FunctionParamsType>[]
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: SubscriptionTransformOutputHook<ServiceClassType, FunctionResultType, FunctionParamsType, any>
    }
  }
}
