import type { z } from 'zod'

import type { ServiceClass } from '../ServiceClass'
import type { AfterGuardHook } from './AfterGuardHook'
import type { BeforeGuardHook } from './BeforeGuardHook'
import type { CommandFunction } from './CommandFunction'
import type { TransformInputHook } from './TransformInputHook'
import type { TransformOutputHook } from './TransformOutputHook'

/**
 * The definition for a command provided by some service.
 */
export type CommandDefinition<
  ServiceClassType extends ServiceClass = ServiceClass,
  MetadataType = Record<string, unknown>,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  MessageResultType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
> = {
  commandName: string
  commandDescription: string
  metadata: MetadataType
  call: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType
  >
  eventName?: string
  hooks: {
    onSuccess?: () => Promise<void>
    onError?: () => Promise<void>
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: TransformInputHook<ServiceClassType, MessagePayloadType, MessageParamsType>
    }
    beforeGuard?: BeforeGuardHook<
      ServiceClassType,
      MessagePayloadType,
      MessageParamsType,
      FunctionPayloadType,
      FunctionParamsType
    >[]
    afterGuard?: AfterGuardHook<ServiceClassType, MessageResultType, MessagePayloadType, MessageParamsType>[]
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: TransformOutputHook<
        ServiceClassType,
        MessagePayloadType,
        MessageResultType,
        FunctionParamsType,
        unknown
      >
    }
  }
}
