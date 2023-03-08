import type { z } from 'zod'

import type { ServiceClass } from '../ServiceClass'
import type { CommandAfterGuardHook } from './CommandAfterGuardHook'
import type { CommandBeforeGuardHook } from './CommandBeforeGuardHook'
import type { CommandFunction } from './CommandFunction'
import type { CommandTransformInputHook } from './CommandTransformInputHook'
import type { CommandTransformOutputHook } from './CommandTransformOutputHook'

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
  FunctionResultType = unknown,
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
    transformInput?: {
      transformInputSchema: z.ZodType
      transformParameterSchema: z.ZodType
      transformFunction: CommandTransformInputHook<ServiceClassType, MessagePayloadType, MessageParamsType>
    }
    beforeGuard?: Record<
      string,
      CommandBeforeGuardHook<
        ServiceClassType,
        MessagePayloadType,
        MessageParamsType,
        FunctionPayloadType,
        FunctionParamsType
      >
    >
    afterGuard?: Record<
      string,
      CommandAfterGuardHook<
        ServiceClassType,
        MessagePayloadType,
        MessageParamsType,
        FunctionResultType,
        FunctionPayloadType,
        FunctionParamsType
      >
    >
    transformOutput?: {
      transformOutputSchema: z.ZodType
      transformFunction: CommandTransformOutputHook<
        ServiceClassType,
        MessagePayloadType,
        MessageResultType,
        FunctionParamsType,
        unknown
      >
    }
  }
}
