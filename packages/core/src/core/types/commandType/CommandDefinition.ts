import type { z } from 'zod'

import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { FromInvokeToOtherType } from '../FromInvokeToOtherType.js'
import type { ServiceClass } from '../ServiceClass.js'
import type { CommandAfterGuardHook } from './CommandAfterGuardHook.js'
import type { CommandBeforeGuardHook } from './CommandBeforeGuardHook.js'
import type { CommandDefinitionMetadataBase } from './CommandDefinitionMetadataBase.js'
import type { CommandFunction } from './CommandFunction.js'
import type { CommandTransformInputHook } from './CommandTransformInputHook.js'
import type { CommandTransformOutputHook } from './CommandTransformOutputHook.js'

/**
 * The definition for a command provided by some service.
 *
 * @group Command
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
  Invokes = {},
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
    FunctionPayloadType,
    FunctionParamsType,
    FunctionResultType,
    Invokes
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
        FunctionParamsType,
        Invokes
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
        FunctionParamsType,
        Invokes
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
  invokes: FromInvokeToOtherType<
    Invokes,
    { outputSchema?: z.ZodType; payloadSchema?: z.ZodType; parameterSchema?: z.ZodType }
  >
}
