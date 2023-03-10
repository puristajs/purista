import type { z } from 'zod'

import { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig'
import type { ServiceClass } from '../ServiceClass'
import type { CommandAfterGuardHook } from './CommandAfterGuardHook'
import type { CommandBeforeGuardHook } from './CommandBeforeGuardHook'
import { CommandDefinitionMetadataBase } from './CommandDefinitionMetadataBase'
import type { CommandFunction } from './CommandFunction'
import type { CommandTransformInputHook } from './CommandTransformInputHook'
import type { CommandTransformOutputHook } from './CommandTransformOutputHook'

/**
 * The definition for a command provided by some service.
 */
export type CommandDefinition<
  ServiceClassType extends ServiceClass = ServiceClass,
  MetadataType = CommandDefinitionMetadataBase,
  MessagePayloadType = unknown,
  MessageParamsType = unknown,
  MessageResultType = unknown,
  FunctionPayloadType = MessagePayloadType,
  FunctionParamsType = MessageParamsType,
  FunctionResultType = unknown,
> = {
  /** the name of the command */
  commandName: string
  /** the description of the command */
  commandDescription: string
  /** the metadata of the command */
  metadata: MetadataType
  /** config information for event bridge */
  eventBridgeConfig: DefinitionEventBridgeConfig
  /** the command function */
  call: CommandFunction<
    ServiceClassType,
    MessagePayloadType,
    MessageParamsType,
    MessagePayloadType,
    MessageParamsType,
    MessageResultType
  >
  /** the eventName for the command response */
  eventName?: string
  /** hooks of command */
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
