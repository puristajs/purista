import type { Schema } from '@typeschema/main'
import type { SchemaObject } from 'openapi3-ts/oas31'

import type { InvokeList, Service } from '../../index.js'
import type { DefinitionEventBridgeConfig } from '../DefinitionEventBridgeConfig.js'
import type { FromEmitToOtherType } from '../FromEmitToOtherType.js'
import type { FromInvokeToOtherType } from '../FromInvokeToOtherType.js'
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
	S extends Service,
	MessagePayloadType,
	MessageParamsType,
	TransformInputPayload,
	TransformInputParams,
	FunctionPayloadType,
	FunctionParamsType,
	FunctionOutputType,
	FinalFunctionOutputType,
	TransformOutputHookOutput,
	Resources extends Record<string, any>,
	Invokes extends InvokeList,
	EmitList extends Record<string, Schema>,
	MetadataType extends CommandDefinitionMetadataBase = CommandDefinitionMetadataBase,
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
		S,
		MessagePayloadType,
		MessageParamsType,
		FunctionPayloadType,
		FunctionParamsType,
		FunctionOutputType,
		Resources,
		Invokes,
		EmitList
	>
	/** the eventName for the command response */
	eventName?: string
	/** hooks of command */
	hooks: {
		transformInput?: {
			transformInputSchema: Schema
			transformParameterSchema: Schema
			transformFunction: CommandTransformInputHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				TransformInputPayload,
				TransformInputParams,
				FunctionPayloadType,
				FunctionParamsType
			>
		}
		beforeGuard?: Record<
			string,
			CommandBeforeGuardHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FunctionPayloadType,
				FunctionParamsType,
				Resources,
				Invokes,
				EmitList
			>
		>
		afterGuard?: Record<
			string,
			CommandAfterGuardHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FunctionPayloadType,
				FunctionParamsType,
				FunctionOutputType,
				Resources,
				Invokes,
				EmitList
			>
		>
		transformOutput?: {
			transformOutputSchema: Schema
			transformFunction: CommandTransformOutputHook<
				S,
				MessagePayloadType,
				MessageParamsType,
				FinalFunctionOutputType,
				FunctionParamsType,
				TransformOutputHookOutput
			>
		}
	}
	invokes: FromInvokeToOtherType<
		Invokes,
		{ outputSchema?: SchemaObject; payloadSchema?: SchemaObject; parameterSchema?: SchemaObject }
	>
	emitList: FromEmitToOtherType<EmitList, SchemaObject>
}
