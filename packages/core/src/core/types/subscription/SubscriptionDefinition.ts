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
  /** the name of the subscription */
  subscriptionName: string
  /** the description of the subscription */
  subscriptionDescription: string
  /** the metadata of the subscription */
  metadata: MetadataType
  /** the subscription function */
  call: SubscriptionFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType
  >
  /** filter for messages produced by given sender */
  sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  /** filter for messages consumed by given receiver */
  receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
  }
  /** filter for message type */
  messageType?: EBMessageType
  /** filter forevent name */
  eventName?: string
  /** event name to be used for custom message if the subscription functions returns value  */
  emitEventName?: string
  /** filter for instance id */
  instanceId?: InstanceId
  /** filter for principal id */
  principalId?: PrincipalId
  /** subscription settings */
  settings: SubscriptionSettings
  /** hooks of subscription */
  hooks: {
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: SubscriptionTransformInputHook<ServiceClassType, MessagePayloadType, MessageParamsType>
    }
    beforeGuard?: Record<string, SubscriptionBeforeGuardHook<ServiceClassType, FunctionPayloadType, FunctionParamsType>>
    afterGuard?: Record<
      string,
      SubscriptionAfterGuardHook<ServiceClassType, FunctionResultType, FunctionPayloadType, FunctionParamsType>
    >
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: SubscriptionTransformOutputHook<ServiceClassType, FunctionResultType, FunctionParamsType, any>
    }
  }
}
