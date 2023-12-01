import type { z } from 'zod'

import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig'
import type { EBMessageType } from '../EBMessageType.enum'
import type { InstanceId } from '../InstanceId'
import type { PrincipalId } from '../PrincipalId'
import type { ServiceClass } from '../ServiceClass'
import type { TenantId } from '../TenantId'
import type { SubscriptionAfterGuardHook } from './SubscriptionAfterGuardHook'
import type { SubscriptionBeforeGuardHook } from './SubscriptionBeforeGuardHook'
import type { SubscriptionDefinitionMetadataBase } from './SubscriptionDefinitionMetadataBase'
import type { SubscriptionFunction } from './SubscriptionFunction'
import type { SubscriptionTransformInputHook } from './SubscriptionTransformInputHook'
import type { SubscriptionTransformOutputHook } from './SubscriptionTransformOutputHook'

/**
 * The definition for a subscription provided by some service.
 *
 * @group Subscription
 */
export type SubscriptionDefinition<
  ServiceClassType extends ServiceClass = ServiceClass,
  MetadataType = SubscriptionDefinitionMetadataBase,
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
  /** config information for event bridge */
  eventBridgeConfig: DefinitionEventBridgeConfig
  /** the subscription function */
  call: SubscriptionFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType
  >
  /** filter for messages produced by given sender */
  sender?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
    instanceId?: InstanceId
  }
  /** filter for messages consumed by given receiver */
  receiver?: {
    serviceName?: string
    serviceVersion?: string
    serviceTarget?: string
    instanceId?: InstanceId
  }
  /** filter for message type */
  messageType?: EBMessageType
  /** filter forevent name */
  eventName?: string
  /** event name to be used for custom message if the subscription functions returns value  */
  emitEventName?: string
  /** filter for principal id */
  principalId?: PrincipalId
  /** filter for tenant id */
  tenantId?: TenantId
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
